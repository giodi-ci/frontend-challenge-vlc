export function rangePercent (minimum, maximum, percent) {
  const calculation = ((percent * (Number(maximum) - Number(minimum)) / 100) + Number(minimum))

  return calculation
}

export function totalPayable (FTT, interestRate, numberOfInstallments, loanAmount) {
  const totalPayableCalc = ((Number(FTT) / 100) + (Number(interestRate) / 100) + (Number(numberOfInstallments) / 1000) + 1) * Number(loanAmount)
  return totalPayableCalc.toFixed(2)
}

export function monthlyInstallment (totalPayable, numberOfInstallments) {
  const monthlyInstallmentCalc = totalPayable / Number(numberOfInstallments)
  return monthlyInstallmentCalc.toFixed(2)
}

// TODO: format number for input, range, and totalPayable eg. 100,000.00
