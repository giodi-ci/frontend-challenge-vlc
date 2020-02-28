import './styles.css'
import data from './../data/data.json'

import { rangePercent, totalPayable, monthlyInstallment } from './helper'

// TODO: move this to constructor?
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

// TODO: add checker for inputs
export const checkFormValidity = formElement => formElement.checkValidity()

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

export function getAssetData (selection) {
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
// TODO: double check if needed
export function fetchJSONFile (path, callback) {
  var httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText)
        if (callback) callback(data)
      }
    }
  }
  httpRequest.open('GET', path)
  httpRequest.send()
}

export function getDataAsset (asset) {
  fetchJSONFile('./../data/data.json', function (data) {
    return data[asset]
  })
  
  const dataAsset = data[asset]

  return dataAsset
}

export function handleChangeAsset (asset) {
  asset.addEventListener('change', (e) => {
    const { selectedIndex } = e.target.options
    const assetChosen = e.target.options[selectedIndex].value

    updateView(getDataAsset(assetChosen))
  })
}

export function getSelectedInstallments () {
  const { selectedIndex } = installments.options

  return installments.options[selectedIndex].value
}

export function getSelectedAsset () {
  const { selectedIndex } = assetOption.options

  return assetOption.options[selectedIndex].value
}

export function handleChangeRangeWarranty (
  warrantyRangeElement,
  assetWarrantyElement
) {
  // TODO: update input on change slider range
  warrantyRangeElement.addEventListener('change', function (event) {
    const { minimum, maximum } = getAssetData(getSelectedAsset()).collateral
    assetWarrantyElement.value = rangePercent(minimum, maximum, event.target.value)
  })
}

export function handleChangeLoanAmount (
  loanAmountRangeElement,
  loanAmountElement
) {
  // TODO: update input on change slider range
  loanAmountRangeElement.addEventListener('change', function (event) {
    const { minimum, maximum } = getAssetData(getSelectedAsset()).loan
    // TODO: loan max value shouldn't be > collateral value
    loanAmountElement.value = rangePercent(minimum, maximum, event.target.value)
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
  const currentInstallments = getSelectedInstallments()
  const currentLoanAmount = loanInput.value
  const total = totalPayable(fft, interest, currentInstallments, currentLoanAmount)
  const monthly = monthlyInstallment(total, currentInstallments)

  monthlyResult.innerHTML = monthly
  totalResult.innerHTML = total
}

export default class CreditasChallenge {
  static initialize () {
    // TODO: move it to addDataValue()
    // TODO: add span range and totalPayable
    interestRate.innerHTML = `${data.rules.interest}%`
    this.registerEvents()
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
