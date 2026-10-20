/**
 * Earned Value Management (EVM) Calculation Engine
 * Standard ANSI/EIA-748 Earned Value Management Systems compliant math
 */

import type { EVMMetrics } from '../types/index.ts';

export function calculateEVM(bac: number, pv: number, ev: number, ac: number): EVMMetrics {
  // Safe math with zero protection
  const safeAC = Math.max(ac, 0.0001);
  const safePV = Math.max(pv, 0.0001);

  // Cost Variance: CV = EV - AC (Positive is good/under budget)
  const cv = Math.round((ev - ac) * 100) / 100;

  // Schedule Variance: SV = EV - PV (Positive is good/ahead of schedule)
  const sv = Math.round((ev - pv) * 100) / 100;

  // Cost Performance Index: CPI = EV / AC (>1.0 is favorable)
  const cpi = Math.round((ev / safeAC) * 1000) / 1000;

  // Schedule Performance Index: SPI = EV / PV (>1.0 is favorable)
  const spi = Math.round((ev / safePV) * 1000) / 1000;

  // Estimate at Completion: EAC = BAC / CPI
  const eac = cpi > 0.05 ? Math.round((bac / cpi) * 100) / 100 : bac;

  // Estimate to Complete: ETC = EAC - AC
  const etc = Math.max(0, Math.round((eac - ac) * 100) / 100);

  // Variance at Completion: VAC = BAC - EAC (Positive is cost savings)
  const vac = Math.round((bac - eac) * 100) / 100;

  // To-Complete Performance Index: TCPI = (BAC - EV) / (BAC - AC)
  const remainingBudget = bac - ac;
  const tcpi = remainingBudget > 0 
    ? Math.round(((bac - ev) / remainingBudget) * 1000) / 1000 
    : 1.0;

  return {
    bac,
    pv,
    ev,
    ac,
    cv,
    sv,
    cpi,
    spi,
    eac,
    etc,
    vac,
    tcpi,
  };
}

export function evaluateProjectHealth(cpi: number, spi: number): 'optimal' | 'moderate_risk' | 'critical_variance' {
  if (cpi >= 0.95 && spi >= 0.95) {
    return 'optimal';
  }
  if (cpi < 0.85 || spi < 0.85) {
    return 'critical_variance';
  }
  return 'moderate_risk';
}
