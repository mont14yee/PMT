/**
 * Autopilot Autonomy Boundary & Guardrail Engine
 * 
 * Strict Constraint Enforcement:
 * Autopilot is strictly a monitor-and-notify intelligence agent.
 * It is FORBIDDEN by code invariants from:
 * 1. Autonomously approving expenditure (change orders, payout authorizations, subcontract additions)
 * 2. Changing an approved baseline (schedule dates, budget allocations, WBS baselines)
 * 3. Making engineering decisions (structural modifications, code variances, material waivers)
 * 4. Sending consequential contractual communications (liquidated damages notices, default notices, formal claims)
 */

export type AutonomousActionType =
  | 'APPROVE_CHANGE_ORDER'
  | 'MODIFY_BASELINE_SCHEDULE'
  | 'MODIFY_BUDGET_BASELINE'
  | 'APPROVE_TECHNICAL_RFI_SUBMITTAL'
  | 'SEND_LIQUIDATED_DAMAGES_NOTICE'
  | 'SEND_CONTRACT_DEFAULT_NOTICE'
  | 'DISPATCH_RISK_ADVISORY'
  | 'SEND_PM_NOTIFICATION'
  | 'CALCULATE_METRICS'
  | 'DRAFT_RECOMMENDATION';

export interface GuardrailEvaluation {
  actionType: AutonomousActionType;
  isPermittedAutonomously: boolean;
  category: 'expenditure' | 'baseline' | 'engineering' | 'contractual' | 'monitor_notify';
  violationReason?: string;
  governingPolicy: string;
  enforcedAction: 'EXECUTE' | 'INTERCEPT_AS_ADVISORY' | 'BLOCK_AND_ESCALATE';
}

const FORBIDDEN_RULES: Record<
  AutonomousActionType,
  {
    category: 'expenditure' | 'baseline' | 'engineering' | 'contractual' | 'monitor_notify';
    isPermitted: boolean;
    policy: string;
    reason: string;
  }
> = {
  APPROVE_CHANGE_ORDER: {
    category: 'expenditure',
    isPermitted: false,
    policy: 'POLICY-E1: EXPENDITURE_AUTHORIZATION_PROTECTION',
    reason: 'Autopilot cannot autonomously authorize financial commitments or approve change orders. Requires Project Manager / Client financial sign-off.',
  },
  MODIFY_BASELINE_SCHEDULE: {
    category: 'baseline',
    isPermitted: false,
    policy: 'POLICY-B1: SCHEDULE_BASELINE_INTEGRITY',
    reason: 'Approved schedule baselines cannot be altered autonomously. Slippage must be flagged as variance advisory.',
  },
  MODIFY_BUDGET_BASELINE: {
    category: 'baseline',
    isPermitted: false,
    policy: 'POLICY-B2: COST_BASELINE_INTEGRITY',
    reason: 'Approved budget baselines cannot be modified autonomously. Cost overruns require formal variance reporting.',
  },
  APPROVE_TECHNICAL_RFI_SUBMITTAL: {
    category: 'engineering',
    isPermitted: false,
    policy: 'POLICY-T1: LICENSED_ENGINEERING_DISCIPLINE',
    reason: 'Engineering, structural, and code compliance approvals require licensed Professional Engineer (PE) or Architect of Record review.',
  },
  SEND_LIQUIDATED_DAMAGES_NOTICE: {
    category: 'contractual',
    isPermitted: false,
    policy: 'POLICY-C1: FORMAL_CONTRACTUAL_COMMUNICATION',
    reason: 'Formal delay, default, and liquidated damages notices carry binding legal consequences and require executive/legal counsel sign-off.',
  },
  SEND_CONTRACT_DEFAULT_NOTICE: {
    category: 'contractual',
    isPermitted: false,
    policy: 'POLICY-C2: NOTICE_OF_DEFAULT_PROTECTION',
    reason: 'Default notices require explicit Owner/Contractor representative authorization.',
  },
  // Permitted Monitor-and-Notify actions:
  DISPATCH_RISK_ADVISORY: {
    category: 'monitor_notify',
    isPermitted: true,
    policy: 'POLICY-M1: AUTONOMOUS_MONITORING_PERMITTED',
    reason: 'Continuous background monitoring, variance calculation, and dispatching actionable advisories to human PMs is fully permitted.',
  },
  SEND_PM_NOTIFICATION: {
    category: 'monitor_notify',
    isPermitted: true,
    policy: 'POLICY-M2: NOTIFICATION_BROADCAST_PERMITTED',
    reason: 'Proactive SMS/email/in-app alerting on schedule delays and cost risk is permitted.',
  },
  CALCULATE_METRICS: {
    category: 'monitor_notify',
    isPermitted: true,
    policy: 'POLICY-M3: DATA_ANALYSIS_PERMITTED',
    reason: 'Earned value calculations, critical path evaluations, and risk scoring are permitted.',
  },
  DRAFT_RECOMMENDATION: {
    category: 'monitor_notify',
    isPermitted: true,
    policy: 'POLICY-M4: DRAFT_RECOMMENDATION_PERMITTED',
    reason: 'Preparing draft response language for human PM review and approval is permitted.',
  },
};

export function evaluateGuardrail(action: AutonomousActionType): GuardrailEvaluation {
  const rule = FORBIDDEN_RULES[action];
  if (!rule) {
    return {
      actionType: action,
      isPermittedAutonomously: false,
      category: 'engineering',
      violationReason: 'Unrecognized action type. Defaulting to strict containment.',
      governingPolicy: 'POLICY-Z0: FAIL_CLOSED_SAFETY_DEFAULT',
      enforcedAction: 'BLOCK_AND_ESCALATE',
    };
  }

  if (rule.isPermitted) {
    return {
      actionType: action,
      isPermittedAutonomously: true,
      category: rule.category,
      governingPolicy: rule.policy,
      enforcedAction: 'EXECUTE',
    };
  }

  return {
    actionType: action,
    isPermittedAutonomously: false,
    category: rule.category,
    violationReason: rule.reason,
    governingPolicy: rule.policy,
    enforcedAction: 'INTERCEPT_AS_ADVISORY',
  };
}
