# Makefile for Organic OS

.PHONY: help install install-web install-api test test-web test-api build-web build-api lint lint-web lint-api dev-web dev-api

# Default target
help:
	@echo "Organic OS Development Commands"
	@echo ""
	@echo "Frontend (Next.js):"
	@echo "  install-web    - Install web dependencies"
	@echo "  dev-web       - Start development server"
	@echo "  test-web      - Run frontend tests"
	@echo "  test-web-cov  - Run tests with coverage"
	@echo "  lint-web      - Lint frontend code"
	@echo "  build-web     - Build for production"
	@echo ""
	@echo "Backend (FastAPI):"
	@echo "  install-api   - Install API dependencies"
	@echo "  dev-api       - Start development server"
	@echo "  test-api      - Run backend tests"
	@echo "  test-api-cov  - Run tests with coverage"
	@echo "  lint-api      - Lint backend code"
	@echo "  build-api     - Build API"
	@echo ""
	@echo "All:"
	@echo "  install       - Install all dependencies"
	@echo "  test          - Run all tests"
	@echo "  lint          - Run all linters"
	@echo "  build         - Build everything"

# Installation
install:
	npm ci --workspace=apps/web
	pip install -r apps/api/requirements.txt

install-web:
	npm ci --workspace=apps/web

install-api:
	pip install -r apps/api/requirements.txt
	pip install pytest pytest-asyncio httpx

# Development servers
dev-web:
	cd apps/web && npm run dev

dev-api:
	cd apps/api && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Testing
test: test-web test-api

test-web:
	cd apps/web && npm run test:run

test-web-cov:
	cd apps/web && npm run test:coverage

test-api:
	cd apps/api && pytest -v --tb=short

test-api-cov:
	cd apps/api && pytest --cov=. --cov-report=term-missing

# Linting
lint: lint-web lint-api

lint-web:
	cd apps/web && npm run lint

lint-api:
	python -m flake8 apps/api --max-line-length=100 || echo "flake8 not installed"

# Building
build: build-web build-api

build-web:
	cd apps/web && npm run build

build-api:
	cd apps/api && echo "FastAPI doesn't require build step"
