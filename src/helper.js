export function rangePercent (minimum, maximum, percent) {
  const calculation = ((percent * (Number(maximum) - Number(minimum)) / 100) + Number(minimum))

  return calculation
}

export function inputPercent (minimum, maximum, value) {
  const min = Number(minimum)
  const max = Number(maximum)
  const val = Number(value)
  const inRange = val >= min && val <= max

  let calculation = -1

  if (inRange) {
    calculation = ((value - min) / (max - min)) * 100
    return calculation
  }

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

export function checkInput (value) {
  const onlyNumber = /^\d+$/

  return onlyNumber.test(value)
}

// TODO: format number for input, range, and totalPayable eg. 100,000.00
