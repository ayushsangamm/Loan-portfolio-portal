import type { RepaymentPeriod } from '../features/loans/loanTypes';

/**
 * Calculates the Equated Monthly Installment (EMI) for a loan.
 * Formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
 */
export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  
  if (monthlyRate === 0) {
    return Math.round(principal / tenureMonths);
  }
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
              
  return Math.round(emi);
};

/**
 * Generates a full month-wise amortization schedule for a new loan.
 */
export const generateAmortizationSchedule = (
  principal: number, 
  annualRate: number, 
  tenureMonths: number,
  disbursementDate: string
): RepaymentPeriod[] => {
  const schedule: RepaymentPeriod[] = [];
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  
  let remainingPrincipal = principal;
  const startDate = new Date(disbursementDate);
  
  for (let month = 1; month <= tenureMonths; month++) {
    const interest = Math.round(remainingPrincipal * monthlyRate);
    const principalPaid = Math.min(Math.round(emi - interest), remainingPrincipal);
    remainingPrincipal = Math.max(0, remainingPrincipal - principalPaid);
    
    // Add month to date
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + month);
    const dueDateStr = dueDate.toISOString().slice(0, 10);
    
    schedule.push({
      month,
      dueDate: dueDateStr,
      emiAmount: emi,
      principal: principalPaid,
      interest,
      remainingPrincipal,
      status: 'Pending'
    });
  }
  
  return schedule;
};
