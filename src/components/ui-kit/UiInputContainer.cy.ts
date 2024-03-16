import UiInputContainer from '@/components/ui-kit/UiInputContainer.vue'

describe('<UiInputContainer />', () => {
  it('renders', () => {
    cy.mount(UiInputContainer)
  })
  it('render slot', () => {
    const slotSelector = '.ui-input-container__slot'
    const slotText = 'Test-text'
    cy.mount(UiInputContainer, {
      slots: {
        default: slotText
      }
    })
    cy.get(slotSelector)
      .should('have.text', slotText)
  })
  // --- Props tests: inputId ---
  it('set inputId', () => {
    const inputId = 'test-input-id'
    const label = 'Test-label'
    cy.mount(UiInputContainer, {
      props: { label }
    })
    cy.get('label').should('not.have.attr', 'for')
    cy.mount(UiInputContainer, {
      props: { inputId, label }
    })
    cy.get('label').should('have.attr', 'for', inputId)
  })
  // --- Props tests: state ---
  it('matches the specified state', () => {
    const slotSelector = '.ui-input-container__slot'
    const states = [{
      borderColor: '#1A1A1A',
      state: undefined
    }, {
      borderColor: '#1A1A1A',
      state: 'idle'
    }, {
      outlineColor: '#B78F00',
      state: 'editing'
    }, {
      borderColor: '#EC0000',
      state: 'error'
    }, {
      borderColor: '#949494',
      state: 'disabled'
    }]
    for (const { state, borderColor, outlineColor } of states) {
      cy.mount(UiInputContainer, {
        props: { state }
      })
      if (outlineColor) {
        cy.get(slotSelector)
          .should('have.css', 'border-color', 'rgba(0, 0, 0, 0)')
        cy.get(slotSelector)
          .should('have.css', 'outline-color')
          .and('be.colored', outlineColor)
      } else {
        cy.get(slotSelector)
          .should('have.css', 'border-color')
          .and('be.colored', borderColor)
      }
    }
  })
  // --- Props tests: required ---
  it('have required', () => {
    const label = 'Test-label'
    const requiredSelector = '.ui-input-container__required'
    cy.mount(UiInputContainer, {
      props: { label }
    })
    cy.get(requiredSelector).should('not.exist')
    cy.mount(UiInputContainer, {
      props: { required: false, label }
    })
    cy.get(requiredSelector).should('not.exist')
    cy.mount(UiInputContainer, {
      props: { required: true, label }
    })
    cy.get(requiredSelector)
      .contains('*')
  })
  // --- Props tests: label ---
  it('render label', () => {
    const label = 'Test-label'
    cy.mount(UiInputContainer)
    cy.get('label').should('not.exist')
    cy.mount(UiInputContainer, {
      props: { label }
    })
    cy.get('label').should('have.text', label)
  })
  // --- Props tests: supportText ---
  it('render support text', () => {
    const supportText = 'Support text'
    const supportTextSelector = '.ui-input-container__support-text'
    cy.mount(UiInputContainer)
    cy.get(supportTextSelector).should('not.exist')
    cy.mount(UiInputContainer, {
      props: { supportText }
    })
    cy.get(supportTextSelector).should('have.text', supportText)
  })
  // --- Props tests: errorText ---
  it('render error text', () => {
    const errorText = 'Error text'
    const errorTextSelector = '.ui-input-container__error-text'
    cy.mount(UiInputContainer)
    cy.get(errorTextSelector).should('not.exist')
    cy.mount(UiInputContainer, {
      props: { errorText }
    })
    cy.get(errorTextSelector).should('have.text', errorText)
  })
})

describe('<UiInputContainer /> with text input', () => {
  // --- Test inputId ---
  it('label connected to input', () => {
    const inputId = 'test-input-id'
    const label = 'Test-label'
    const slotEl = `<input id="${inputId}"/>`
    cy.mount(UiInputContainer, {
      props: { inputId, label },
      slots: {
        default: slotEl
      }
    })
    cy.get('label').click()
    cy.get(`#${inputId}`).should('have.focus')
  })
})
