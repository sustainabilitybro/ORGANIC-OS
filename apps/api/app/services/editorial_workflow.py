"""
Editorial Workflow Service.
Multi-stage review process for all database entries.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.curators import Submission, ReviewRecord, Curator


class SubmissionStatus(Enum):
    """Possible statuses for a submission."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    CURATOR_REVIEW = "curator_review"
    CURATOR_APPROVED = "curator_approved"
    REVISIONS_REQUESTED = "revisions_requested"
    FINAL_REVIEW = "final_review"
    PUBLISHED = "published"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class ReviewDecision(Enum):
    """Possible decisions for a review."""
    APPROVED = "approved"
    REVISIONS_REQUESTED = "revisions_requested"
    REJECTED = "rejected"


@dataclass
class WorkflowResult:
    """Result of a workflow action."""
    success: bool
    submission_id: int
    new_status: str
    message: str
    next_steps: List[str] = None


class EditorialWorkflowService:
    """
    Multi-stage review process for all entries.
    
    Workflow Stages:
    1. Submission - Content is submitted by contributor
    2. Curator Review - Domain expert reviews for accuracy
    3. Final Review - Lead reviewer approves for publication
    4. Publication - Entry goes live in database
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_submission(
        self,
        submitter_id: int,
        entry_type: str,
        content: Dict[str, Any],
        supporting_docs: List[str] = None,
        priority: int = 3
    ) -> WorkflowResult:
        """
        Stage 1: Create a new submission.
        
        Args:
            submitter_id: ID of the curator submitting
            entry_type: Type of entry ('organism', 'indication', 'remedy_indication', etc.)
            content: The actual data being submitted
            supporting_docs: URLs or file references for supporting documents
            priority: 1-5 priority level (1=highest)
            
        Returns:
            WorkflowResult with submission ID and status
        """
        from ..services.data_validation import validate_entry
        
        # Validate the submission data
        validation_result = validate_entry(content, entry_type)
        
        if not validation_result.is_valid:
            return WorkflowResult(
                success=False,
                submission_id=0,
                new_status="validation_failed",
                message="Submission failed validation",
                next_steps=[f"Fix error: {e['message']}" for e in validation_result.errors]
            )
        
        # Create submission record
        submission = Submission(
            submitter_id=submitter_id,
            entry_type=entry_type,
            content=content,
            supporting_documents=supporting_docs or [],
            status=SubmissionStatus.SUBMITTED.value,
            validation_status="passed" if validation_result.is_valid else "failed",
            validation_errors=validation_result.errors,
            priority=priority
        )
        
        self.db.add(submission)
        await self.db.commit()
        await self.db.refresh(submission)
        
        # Auto-assign curator based on expertise
        curator_id = await self._assign_curator(entry_type, content)
        if curator_id:
            submission.curator_assigned_id = curator_id
            submission.status = SubmissionStatus.CURATOR_REVIEW.value
            await self.db.commit()
        
        return WorkflowResult(
            success=True,
            submission_id=submission.id,
            new_status=submission.status,
            message="Submission created successfully",
            next_steps=["Awaiting curator review"] if curator_id else ["Manual assignment needed"]
        )
    
    async def curator_review(
        self,
        submission_id: int,
        curator_id: int,
        decision: str,
        comments: str = None,
        issues_found: List[Dict] = None,
        suggested_changes: List[Dict] = None,
        evidence_verified: bool = False,
        sources_checked: bool = False,
        safety_verified: bool = False
    ) -> WorkflowResult:
        """
        Stage 2: Curator reviews the submission.
        
        Args:
            submission_id: ID of the submission
            curator_id: ID of the reviewing curator
            decision: 'approved', 'revisions_requested', or 'rejected'
            comments: Review comments
            issues_found: List of issues found
            suggested_changes: Suggested modifications
            evidence_verified: Whether evidence was verified
            sources_checked: Whether sources were checked
            safety_verified: Whether safety data was verified
            
        Returns:
            WorkflowResult with new status
        """
        # Get submission
        result = await self.db.execute(
            select(Submission).where(Submission.id == submission_id)
        )
        submission = result.scalar_one_or_none()
        
        if not submission:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status="not_found",
                message="Submission not found"
            )
        
        # Check curator authorization
        can_review, reason = await self._check_curator_can_review(curator_id, submission)
        if not can_review:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message=reason
            )
        
        # Create review record
        review = ReviewRecord(
            submission_id=submission_id,
            curator_id=curator_id,
            review_type="domain_expert",
            decision=decision,
            comments=comments,
            issues_found=issues_found or [],
            suggested_changes=suggested_changes or [],
            evidence_verified=evidence_verified,
            sources_checked=sources_checked,
            safety_data_verified=safety_verified
        )
        
        self.db.add(review)
        
        # Update submission status based on decision
        if decision == ReviewDecision.APPROVED.value:
            submission.status = SubmissionStatus.FINAL_REVIEW.value
            message = "Approved for final review"
            next_steps = ["Awaiting lead reviewer approval"]
        
        elif decision == ReviewDecision.REVISIONS_REQUESTED.value:
            submission.status = SubmissionStatus.REVISIONS_REQUESTED.value
            message = "Revisions requested"
            next_steps = ["Address reviewer comments", "Resubmit for review"]
        
        elif decision == ReviewDecision.REJECTED.value:
            submission.status = SubmissionStatus.REJECTED.value
            message = f"Submission rejected. Reason: {comments}"
            next_steps = ["Review rejection reason", "Consider resubmission with changes"]
        
        else:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message=f"Invalid decision: {decision}"
            )
        
        await self.db.commit()
        
        return WorkflowResult(
            success=True,
            submission_id=submission_id,
            new_status=submission.status,
            message=message,
            next_steps=next_steps
        )
    
    async def final_review(
        self,
        submission_id: int,
        lead_reviewer_id: int,
        decision: str,
        comments: str = None
    ) -> WorkflowResult:
        """
        Stage 3: Lead reviewer final approval.
        
        Args:
            submission_id: ID of the submission
            lead_reviewer_id: ID of the lead reviewer
            decision: 'approved', 'revisions_requested', or 'rejected'
            comments: Review comments
            
        Returns:
            WorkflowResult with new status and published_id if approved
        """
        # Get submission
        result = await self.db.execute(
            select(Submission).where(Submission.id == submission_id)
        )
        submission = result.scalar_one_or_none()
        
        if not submission:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status="not_found",
                message="Submission not found"
            )
        
        # Verify lead reviewer permissions
        reviewer = await self._get_curator(lead_reviewer_id)
        if not reviewer or not reviewer.can_approve_final:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message="Reviewer does not have final approval permissions"
            )
        
        # Create review record
        review = ReviewRecord(
            submission_id=submission_id,
            curator_id=lead_reviewer_id,
            review_type="final",
            decision=decision,
            comments=comments
        )
        
        self.db.add(review)
        
        # Handle decision
        if decision == ReviewDecision.APPROVED.value:
            # Publish the entry
            published_id = await self._publish_entry(submission)
            
            submission.status = SubmissionStatus.PUBLISHED.value
            submission.published_id = published_id
            submission.published_date = datetime.now()
            
            message = f"Entry published successfully (ID: {published_id})"
            next_steps = ["Entry is now live in the database"]
        
        elif decision == ReviewDecision.REVISIONS_REQUESTED.value:
            submission.status = SubmissionStatus.REVISIONS_REQUESTED.value
            message = "Final reviewer requested revisions"
            next_steps = ["Address lead reviewer comments", "Resubmit for review"]
        
        elif decision == ReviewDecision.REJECTED.value:
            submission.status = SubmissionStatus.REJECTED.value
            message = f"Final rejection. Reason: {comments}"
            next_steps = ["Review rejection reason"]
        
        else:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message=f"Invalid decision: {decision}"
            )
        
        await self.db.commit()
        
        return WorkflowResult(
            success=True,
            submission_id=submission_id,
            new_status=submission.status,
            message=message,
            next_steps=next_steps
        )
    
    async def update_submission(
        self,
        submission_id: int,
        submitter_id: int,
        updated_content: Dict[str, Any]
    ) -> WorkflowResult:
        """
        Update a submission with revisions.
        
        Only allowed for submissions in REVISIONS_REQUESTED or DRAFT status.
        """
        result = await self.db.execute(
            select(Submission).where(Submission.id == submission_id)
        )
        submission = result.scalar_one_or_none()
        
        if not submission:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status="not_found",
                message="Submission not found"
            )
        
        # Verify submitter
        if submission.submitter_id != submitter_id:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message="Only the original submitter can update this submission"
            )
        
        # Check status allows updates
        if submission.status not in [SubmissionStatus.REVISIONS_REQUESTED.value, 
                                     SubmissionStatus.DRAFT.value]:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message=f"Cannot update submission in {submission.status} status"
            )
        
        # Validate updated content
        from ..services.data_validation import validate_entry
        validation_result = validate_entry(updated_content, submission.entry_type)
        
        if not validation_result.is_valid:
            return WorkflowResult(
                success=False,
                submission_id=submission_id,
                new_status=submission.status,
                message="Updated content failed validation",
                next_steps=[f"Fix error: {e['message']}" for e in validation_result.errors]
            )
        
        # Update submission
        submission.content = updated_content
        submission.status = SubmissionStatus.SUBMITTED.value
        submission.validation_status = "passed"
        submission.validation_errors = []
        
        await self.db.commit()
        
        return WorkflowResult(
            success=True,
            submission_id=submission_id,
            new_status=submission.status,
            message="Submission updated and resubmitted for review",
            next_steps=["Awaiting curator review"]
        )
    
    async def get_submission_status(self, submission_id: int) -> Dict[str, Any]:
        """Get the current status and history of a submission."""
        result = await self.db.execute(
            select(Submission).where(Submission.id == submission_id)
        )
        submission = result.scalar_one_or_none()
        
        if not submission:
            return {"found": False}
        
        # Get reviews
        reviews_result = await self.db.execute(
            select(ReviewRecord).where(ReviewRecord.submission_id == submission_id)
        )
        reviews = reviews_result.scalars().all()
        
        return {
            "found": True,
            "id": submission.id,
            "status": submission.status,
            "entry_type": submission.entry_type,
            "submitter_id": submission.submitter_id,
            "curator_assigned_id": submission.curator_assigned_id,
            "created_at": submission.created_at,
            "updated_at": submission.updated_at,
            "published_id": submission.published_id,
            "published_date": submission.published_date,
            "validation_status": submission.validation_status,
            "validation_errors": submission.validation_errors,
            "reviews": [
                {
                    "reviewer_id": r.curator_id,
                    "review_type": r.review_type,
                    "decision": r.decision,
                    "comments": r.comments,
                    "review_date": r.review_date
                }
                for r in reviews
            ]
        }
    
    async def get_pending_reviews(self, curator_id: int) -> List[Dict[str, Any]]:
        """Get submissions pending review by a specific curator."""
        result = await self.db.execute(
            select(Submission).where(
                Submission.curator_assigned_id == curator_id,
                Submission.status.in_([
                    SubmissionStatus.CURATOR_REVIEW.value,
                    SubmissionStatus.SUBMITTED.value
                ])
            )
        )
        submissions = result.scalars().all()
        
        return [
            {
                "id": s.id,
                "entry_type": s.entry_type,
                "status": s.status,
                "priority": s.priority,
                "created_at": s.created_at,
                "content_preview": str(s.content)[:200] if s.content else ""
            }
            for s in submissions
        ]
    
    async def _assign_curator(self, entry_type: str, content: Dict[str, Any]) -> Optional[int]:
        """Auto-assign a curator based on expertise and availability."""
        # Get curators with relevant expertise
        result = await self.db.execute(
            select(Curator).where(
                Curator.is_active == True,
                Curator.can_review == True,
                Curator.is_verified == True
            )
        )
        curators = result.scalars().all()
        
        if not curators:
            return None
        
        # Simple assignment: pick curator with lowest review count (load balancing)
        sorted_curators = sorted(curators, key=lambda c: c.reviews_count or 0)
        return sorted_curators[0].id if sorted_curators else None
    
    async def _check_curator_can_review(
        self, 
        curator_id: int, 
        submission: Submission
    ) -> tuple:
        """Check if curator can review this submission (no conflicts)."""
        curator = await self._get_curator(curator_id)
        
        if not curator:
            return False, "Curator not found"
        
        if not curator.can_review:
            return False, "Curator does not have review permissions"
        
        if not curator.is_verified:
            return False, "Curator is not verified"
        
        if curator.is_suspended:
            return False, "Curator account is suspended"
        
        # Check for conflicts of interest
        # (simplified - would check COI table in full implementation)
        if submission.submitter_id == curator_id:
            return False, "Cannot review own submission"
        
        return True, "OK"
    
    async def _get_curator(self, curator_id: int) -> Optional[Curator]:
        """Get curator by ID."""
        result = await self.db.execute(
            select(Curator).where(Curator.id == curator_id)
        )
        return result.scalar_one_or_none()
    
    async def _publish_entry(self, submission: Submission) -> int:
        """Publish a submission to the main database tables."""
        entry_type = submission.entry_type
        content = submission.content
        
        # Import the appropriate model and create the entry
        if entry_type == "organism":
            from ..models.organisms import Organism
            entry = Organism(**content, is_published=True, verification_status="verified")
            self.db.add(entry)
            await self.db.flush()
            return entry.id
        
        elif entry_type == "indication":
            from ..models.indications import Indication
            entry = Indication(**content, verification_status="verified")
            self.db.add(entry)
            await self.db.flush()
            return entry.id
        
        elif entry_type == "remedy_indication":
            from ..models.remedy_indications import RemedyIndication
            entry = RemedyIndication(**content, is_published=True, verification_status="verified")
            self.db.add(entry)
            await self.db.flush()
            return entry.id
        
        elif entry_type == "evidence_item":
            from ..models.evidence import EvidenceItem
            entry = EvidenceItem(**content, is_published=True)
            self.db.add(entry)
            await self.db.flush()
            return entry.id
        
        elif entry_type == "safety_profile":
            from ..models.safety import SafetyProfile
            entry = SafetyProfile(**content, is_published=True, verification_status="verified")
            self.db.add(entry)
            await self.db.flush()
            return entry.id
        
        return 0
