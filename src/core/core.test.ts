import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEVM, evaluateProjectHealth } from './evm.ts';
import { evaluateGuardrail } from './guardrails.ts';
import { analyzeSchedule } from './scheduler.ts';
import type { Milestone } from '../types/index.ts';

test('EVM Calculations: correctly calculates CV, SV, CPI, SPI, EAC', () => {
  // BAC = 1,000,000, PV = 500,000, EV = 400,000, AC = 450,000
  const evm = calculateEVM(1000000, 500000, 400000, 450000);

  // CV = EV - AC = 400,000 - 450,000 = -50,000
  assert.equal(evm.cv, -50000);

  // SV = EV - PV = 400,000 - 500,000 = -100,000
  assert.equal(evm.sv, -100000);

  // CPI = 400000 / 450000 = 0.889
  assert.equal(evm.cpi, 0.889);

  // SPI = 400000 / 500000 = 0.800
  assert.equal(evm.spi, 0.8);

  // Health evaluation: SPI < 0.85 -> critical_variance
  const health = evaluateProjectHealth(evm.cpi, evm.spi);
  assert.equal(health, 'critical_variance');
});

test('EVM Calculations: optimal performance indicators', () => {
  const evm = calculateEVM(1000000, 500000, 520000, 480000);
  assert.equal(evm.cv, 40000);
  assert.equal(evm.sv, 20000);
  assert.ok(evm.cpi > 1.0);
  assert.ok(evm.spi > 1.0);
  assert.equal(evaluateProjectHealth(evm.cpi, evm.spi), 'optimal');
});

test('Autonomy Guardrails: prevents expenditure approval', () => {
  const evaluation = evaluateGuardrail('APPROVE_CHANGE_ORDER');
  assert.equal(evaluation.isPermittedAutonomously, false);
  assert.equal(evaluation.enforcedAction, 'INTERCEPT_AS_ADVISORY');
  assert.equal(evaluation.category, 'expenditure');
  assert.ok(evaluation.violationReason?.includes('financial commitments'));
});

test('Autonomy Guardrails: prevents schedule and budget baseline modifications', () => {
  const scheduleBaseline = evaluateGuardrail('MODIFY_BASELINE_SCHEDULE');
  assert.equal(scheduleBaseline.isPermittedAutonomously, false);
  assert.equal(scheduleBaseline.category, 'baseline');

  const budgetBaseline = evaluateGuardrail('MODIFY_BUDGET_BASELINE');
  assert.equal(budgetBaseline.isPermittedAutonomously, false);
  assert.equal(budgetBaseline.category, 'baseline');
});

test('Autonomy Guardrails: prevents autonomous engineering decisions and technical waivers', () => {
  const engineering = evaluateGuardrail('APPROVE_TECHNICAL_RFI_SUBMITTAL');
  assert.equal(engineering.isPermittedAutonomously, false);
  assert.equal(engineering.category, 'engineering');
  assert.ok(engineering.violationReason?.includes('Professional Engineer'));
});

test('Autonomy Guardrails: prevents unilateral contractual communications', () => {
  const ldNotice = evaluateGuardrail('SEND_LIQUIDATED_DAMAGES_NOTICE');
  assert.equal(ldNotice.isPermittedAutonomously, false);
  assert.equal(ldNotice.category, 'contractual');

  const defaultNotice = evaluateGuardrail('SEND_CONTRACT_DEFAULT_NOTICE');
  assert.equal(defaultNotice.isPermittedAutonomously, false);
  assert.equal(defaultNotice.category, 'contractual');
});

test('Autonomy Guardrails: permits monitor and notify operations', () => {
  const advisory = evaluateGuardrail('DISPATCH_RISK_ADVISORY');
  assert.equal(advisory.isPermittedAutonomously, true);
  assert.equal(advisory.enforcedAction, 'EXECUTE');

  const notify = evaluateGuardrail('SEND_PM_NOTIFICATION');
  assert.equal(notify.isPermittedAutonomously, true);

  const calculate = evaluateGuardrail('CALCULATE_METRICS');
  assert.equal(calculate.isPermittedAutonomously, true);
});

test('Scheduler: correctly flags critical path delays', () => {
  const sampleMilestones: Milestone[] = [
    {
      id: 'm1',
      projectId: 'p1',
      title: 'Foundation Poured',
      category: 'civil',
      plannedStartDate: '2026-01-01',
      plannedEndDate: '2026-02-15',
      actualStartDate: '2026-01-01',
      actualEndDate: '2026-02-15',
      progressPercent: 100,
      criticalPath: true,
      totalFloatDays: 0,
      status: 'completed',
      subcontractor: 'Apex Geotechnical',
    },
    {
      id: 'm2',
      projectId: 'p1',
      title: 'Structural Steel Erection',
      category: 'structural',
      plannedStartDate: '2026-02-16',
      plannedEndDate: '2026-04-10',
      progressPercent: 45,
      criticalPath: true,
      totalFloatDays: -12, // 12 days delayed on critical path
      status: 'delayed',
      subcontractor: 'Vanguard Steel Works',
    },
    {
      id: 'm3',
      projectId: 'p1',
      title: 'HVAC Ductwork Rough-in',
      category: 'mep',
      plannedStartDate: '2026-04-11',
      plannedEndDate: '2026-05-30',
      progressPercent: 0,
      criticalPath: false,
      totalFloatDays: 15,
      status: 'pending',
      subcontractor: 'Delta MEP Corp',
    },
  ];

  const result = analyzeSchedule(sampleMilestones);
  assert.equal(result.totalMilestones, 3);
  assert.equal(result.completedCount, 1);
  assert.equal(result.criticalPathDelayedCount, 1);
  assert.equal(result.maxScheduleVarianceDays, 12);
  assert.equal(result.needsPMEscalation, true);
});
