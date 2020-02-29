import './styles.css'
import data from './../data/data.json'

import { rangePercent, totalPayable, monthlyInstallment, checkInput } from './helper'

// TODO: move this to a constructor?
const assetOption = document.getElementById('collateral')
const collateralMinimum = document.getElementById('collateral-minimum')
const collateralMaximum = document.getElementById('collateral-maximum')
const collateralRange = document.getElementById('collateral-value-range')
const collateralInput = document.getElementById('collateral-value')
const loanMinimum = document.getElementById('loan-minimum')
const loanMaximum = document.getElementById('loan-maximum')
const loanRange = document.getElementById('loan-amount-range')
const loanInput = document.getElementById('loan-amount')
const installments = document.getElementById('installments')
const monthlyResult = document.getElementById('monthly-result')
const totalResult = document.getElementById('total-payable')
const interestRate = document.getElementById('interest-rate')

export const checkFormValidity = formElement => formElement.checkValidity()

export function getUserSelection (element) {
  const { selectedIndex } = element.options

  return element.options[selectedIndex].value
}

export function inputChecker (input) {
  const inputIsANumber = checkInput(input.value)
  inputIsANumber ? input.className = '' : input.className = 'js-value-incorrect'

  return inputIsANumber
}

export function getAssetData () {
  const selection = getUserSelection(assetOption)
  const dataAsset = data[selection]

  return dataAsset
}

export const getFormValues = formElement =>
  Object.values(formElement.elements)
    .filter(element => ['SELECT', 'INPUT'].includes(element.nodeName))
    .map(element => ({
      field: element.name,
      value: element.value
    }))

export const toStringFormValues = values => {
  const match = matchString => value => value.field === matchString
  const IOF = 6.38 / 100
  const INTEREST_RATE = 2.34 / 100
  const NUMBER_OF_INSTALLMENTS = values.find(match('installments')).value / 1000
  const VEHICLE_LOAN_AMOUNT = values.find(match('loan-amount')).value

  return `OUTPUT\n${values
    .map(value => `${value.field} --> ${value.value}`)
    .join('\n')}`.concat(
    `\nTotal ${(IOF + INTEREST_RATE + NUMBER_OF_INSTALLMENTS + 1) * VEHICLE_LOAN_AMOUNT}`
  )
}

export function Send (values) {
  return new Promise((resolve, reject) => {
    try {
      resolve(toStringFormValues(values))
    } catch (error) {
      reject(error)
    }
  })
}

export function Submit (formElement) {
  formElement.addEventListener('submit', function (event) {
    event.preventDefault()
    if (checkFormValidity(formElement)) {
      Send(getFormValues(formElement))
        .then(result => window.confirm(result, 'Your form submitted success'))
        .catch(error => window.alert('Your form submitted error', error))
    }
  })
}

export function Help (element) {
  element.addEventListener('click', function (event) {
    window.alert('Display here the help text')
  })
}

export function handleChangeAsset (asset) {
  asset.addEventListener('change', (e) => {
    updateView(getAssetData())
  })
}

export function handleChangeRangeWarranty (
  assetWarrantyRange,
  assetWarrantyInput
) {
  assetWarrantyRange.addEventListener('change', (e) => {
    const { minimum, maximum } = getAssetData().collateral
    assetWarrantyInput.value = rangePercent(minimum, maximum, e.target.value)
  })

  assetWarrantyInput.addEventListener('input', (e) => {
    if (inputChecker(e.target)) {
      // TODO: update range percent
    }
  }) 
}

export function handleChangeLoanAmount (
  loanAmountRangeElement,
  loanAmountElement
) {
  loanAmountRangeElement.addEventListener('change', function (event) {
    const { minimum, maximum } = getAssetData().loan
    // TODO: loan max value shouldn't be > collateral value
    loanAmountElement.value = rangePercent(minimum, maximum, event.target.value)
  })

  loanAmountElement.addEventListener('input', (e) => {
    if (inputChecker(e.target)) {
      // TODO: update range percent
    }
  })
}

export function handleChangeToShowResult (inputs) {
  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      updateResult(input)
    })
  })
}

export function updateResult () {
  const { fft, interest } = data.rules
  const currentInstallments = getUserSelection(installments)
  const currentLoanAmount = loanInput.value
  const total = totalPayable(fft, interest, currentInstallments, currentLoanAmount)
  const monthly = monthlyInstallment(total, currentInstallments)

  monthlyResult.innerHTML = monthly
  totalResult.innerHTML = total
}

export function updateView (newValues) {
  collateralMinimum.innerText = newValues.collateral.minimum
  collateralMaximum.innerText = newValues.collateral.maximum
  loanMinimum.innerText = newValues.loan.minimum
  loanMaximum.innerText = newValues.loan.maximum

  installments.options.length = 0
  newValues.installments.forEach((option) => {
    let optionDOM = document.createElement('option')
    optionDOM.value = option
    optionDOM.innerHTML = option
    installments.appendChild(optionDOM)
  })

  updateResult()
}

export default class CreditasChallenge {
  static initialize () {
    this.elementsInitialValues()
    this.registerEvents()
  }
  
  static elementsInitialValues () {
    interestRate.innerText = `${data.rules.interest}%`
    collateralMinimum.innerText = getAssetData().collateral.minimum
    collateralMaximum.innerText = getAssetData().collateral.maximum
    loanMinimum.innerText = getAssetData().loan.minimum
    loanMaximum.innerText = getAssetData().loan.maximum
    updateResult()
  }

  static registerEvents () {
    // TODO: double check submit function
    Submit(document.querySelector('.form'))
    
    // TODO: implement Help response
    Help(document.getElementById('help'))

    handleChangeAsset(assetOption)

    handleChangeRangeWarranty(
      collateralRange,
      collateralInput
    )

    handleChangeLoanAmount(
      loanRange,
      loanInput
    )

    handleChangeToShowResult(
      [
        assetOption,
        collateralRange,
        collateralInput,
        loanRange,
        loanInput,
        installments
      ]
    )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  CreditasChallenge.initialize()
})
