/**
 * Construction Schedule & Critical Path Logic Engine
 */

import type { Milestone } from '../types/index.ts';

export interface ScheduleAnalysis {
  totalMilestones: number;
  completedCount: number;
  criticalPathDelayedCount: number;
  averageFloatDays: number;
  maxScheduleVarianceDays: number;
  projectDelayProjectedDays: number;
  needsPMEscalation: boolean;
}

export function analyzeSchedule(milestones: Milestone[]): ScheduleAnalysis {
  if (milestones.length === 0) {
    return {
      totalMilestones: 0,
      completedCount: 0,
      criticalPathDelayedCount: 0,
      averageFloatDays: 0,
      maxScheduleVarianceDays: 0,
      projectDelayProjectedDays: 0,
      needsPMEscalation: false,
    };
  }

  let completedCount = 0;
  let criticalPathDelayedCount = 0;
  let totalFloat = 0;
  let maxDelay = 0;

  for (const m of milestones) {
    if (m.status === 'completed' || m.progressPercent === 100) {
      completedCount++;
    }

    totalFloat += m.totalFloatDays;

    if (m.criticalPath && (m.status === 'delayed' || m.totalFloatDays < 0)) {
      criticalPathDelayedCount++;
      const delay = Math.abs(m.totalFloatDays);
      if (delay > maxDelay) {
        maxDelay = delay;
      }
    }
  }

  const averageFloatDays = Math.round((totalFloat / milestones.length) * 10) / 10;
  const projectDelayProjectedDays = maxDelay;
  const needsPMEscalation = criticalPathDelayedCount > 0 || projectDelayProjectedDays > 7;

  return {
    totalMilestones: milestones.length,
    completedCount,
    criticalPathDelayedCount,
    averageFloatDays,
    maxScheduleVarianceDays: maxDelay,
    projectDelayProjectedDays,
    needsPMEscalation,
  };
}
