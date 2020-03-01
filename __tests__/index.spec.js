/* <!--
  =========================================================
  Que tal aumentar o coverage para que ele comece a passar
  nos critérios do desafio?

  Objetivo: Alcançar 80% de cobertura, mas não se preocupe
  se não chegar a alcançar a objetivo, faça o quanto você
  acha que é necessário para garantir segurança quando um
  outro amigo for mexer no mesmo código que você :)

  Confira nossas taxas de coberturas atuais :(

  ----------|----------|----------|----------|----------|-------------------|
  File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
  ----------|----------|----------|----------|----------|-------------------|
  All files |    15.79 |        0 |     9.52 |    14.29 |                   |
  index.js  |    15.79 |        0 |     9.52 |    14.29 |... 72,76,78,83,91 |
  ----------|----------|----------|----------|----------|-------------------|
  Jest: Uncovered count for statements (32)exceeds global threshold (10)
  Jest: "global" coverage threshold for branches (80%) not met: 0%
  Jest: "global" coverage threshold for lines (80%) not met: 14.29%
  Jest: "global" coverage threshold for functions (80%) not met: 9.52%
--> */

import CreditasChallenge, {
  checkFormValidity,
  getFormValues,
  toStringFormValues,
  Send,
  Submit,
  getUserSelection
} from '../src/index'

import { 
  rangePercent,
  inputPercent,
  checkInput
} from '../src/helper'

function initializeAppMock () {
  document.body.innerHTML = `
    <form class="form" data-testid="form">
      <label for="collateral-value">Collateral Amount</label>
      <input id="collateral-value" required />
      <select name="collateral" id="collateral-select" required>
        <option value="vehicle" selected="selected">Vehicle</option>
        <option value="home">Home</option>
      </select>
      <button type="button"></button>
    </form>
  `
}

function clean () {
  document.body.innerHTML = ''
}

describe('Creditas Challenge', () => {
  beforeEach(() => {
    initializeAppMock()
  })

  afterEach(() => {
    clean()
  })

  describe('Method: checkFormValidity', () => {
    it('should return true when form has valid', () => {
      const form = document.querySelector('.form')
      const input = document.querySelector('input')
      input.value = 10

      expect(checkFormValidity(form)).toBeTruthy()
    })

    it('should return false when form has not valid', () => {
      const form = document.querySelector('.form')

      expect(checkFormValidity(form)).toBeFalsy()
    })
  })

  describe('Method: Submit', () => {
    it('should add event listener to submit data form', () => {
      const form = document.querySelector('.form')
      Submit(form)
    })
  })

  describe('Method: Get form values', () => {
    it('should have length', () => {
      const form = document.querySelector('.form')

      expect(getFormValues(form)).toHaveLength(2)
    })
  })
  
  describe('Method: Get selected element', () => {
    it('should return selected value', () => {
      const selection = document.getElementById('collateral-select')

      expect(getUserSelection(selection)).toBe('vehicle')
    })
  })

  describe('Helper method: from percent to number given max and min', () => {
    it('should return corresponding float number in range', () => {
      const min = 100;
      const max = 5000;
      const percent = 35;
  
      expect(rangePercent(min, max, percent)).toEqual(1815)
    })
  })
  
  describe('Helper method: from number to percent given max and min', () => {
    it('should return corresponding percentage in range', () => {
      const min = 500;
      const max = 2000;
      const value = 1250;
  
      expect(inputPercent(min, max, value)).toEqual(50)
    })
  })
  
  describe('Helper method: check input value only have numbers', () => {
    it('should return false', () => {
      const input = document.querySelector('input')
      input.value = 'test10'

      expect(checkInput(input)).toBeFalsy()
    })
  })
})
