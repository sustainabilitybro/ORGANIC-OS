// Organic OS - Progress Tracking
// Unified Progress Across All Modules
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Link from 'next/link';

interface ModuleProgress {
  module: string;
  completedItems: number;
  totalItems: number;
  streak: number;
  lastActive: Date;
  level: number;
  xp: number;
}

const modules = [
  {
    id: 'identity',
    name: 'Identity',
    icon: '👤',
    color: 'emerald'
  },
  {
    id: 'sensory',
    name: 'Sensory',
    icon: '👁️',
    color: 'cyan'
  },
