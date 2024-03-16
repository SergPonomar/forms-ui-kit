import TextInput from '@/components/form/TextInput.vue'

describe('<TextInput />', () => {
  it('renders', () => {
    cy.mount(TextInput)
  })
  // --- Props tests: name ---
  it('set name', () => {
    cy.mount(TextInput)
    cy.get('input').should('not.have.attr', 'name')
    const name = 'test-name'
    cy.mount(TextInput, {
      props: { name }
    })
    cy.get('input').should('have.attr', 'name', name)
  })
  // --- Props tests: formName + name ---
  it('should have same id for label and input', () => {
    const label = 'Test-label'
    const name = 'test-name'
    const formName = 'text-form'
    const inputId = `${formName}-${name}`
    cy.mount(TextInput, {
      props: { name, formName, label }
    })
    cy.get('input').should('have.attr', 'id', inputId)
    cy.get('label').should('have.attr', 'for', inputId)
  })
  // --- Props tests: label ---
  it('render label', () => {
    const label = 'Test-label'
    cy.mount(TextInput)
    cy.get('label').should('not.exist')
    cy.mount(TextInput, {
      props: { label }
    })
    cy.get('label').should('have.text', label)
  })
  // --- Props tests: supportText ---
  it('render support text', () => {
    const supportText = 'Support text'
    const supportTextSelector = '.ui-input-container__support-text'
    cy.mount(TextInput)
    cy.get(supportTextSelector).should('not.exist')
    cy.mount(TextInput, {
      props: { supportText }
    })
    cy.get(supportTextSelector).should('have.text', supportText)
  })
  // --- Props tests: required ---
  it('have required', () => {
    const label = 'Test-label'
    const requiredSelector = '.ui-input-container__required'
    cy.mount(TextInput, {
      props: { label }
    })
    cy.get(requiredSelector).should('not.exist')
    cy.mount(TextInput, {
      props: { required: false, label }
    })
    cy.get(requiredSelector).should('not.exist')
    cy.mount(TextInput, {
      props: { required: true, label }
    })
    cy.get(requiredSelector)
      .contains('*')
  })
  // --- Props tests: validationFunc ---
  it('validation function applied', () => {
    const defaultError = 'Поле обязательно для заполнения'
    const customError = 'Custom error text'
    const errorSelector = '.ui-input-container__error-text'

    // Default function not required
    cy.mount(TextInput, {
      props: { required: false }
    })
    cy.get('input').focus().blur()
    cy.get(errorSelector).should('not.exist')

    // Default function not required
    cy.mount(TextInput, {
      props: { required: true }
    })
    cy.get('input').focus().blur()
    cy.get(errorSelector).should('have.text', defaultError)

    // Custom function
    const validationFunc = (value: string) => {
      return value.length > 3 ? '' : customError
    }
    cy.mount(TextInput, {
      props: { validationFunc }
    })
    cy.get('input').focus().type('12').blur()
    cy.get(errorSelector).should('have.text', customError)
    cy.get('input').focus().type('1234').blur()
    cy.get(errorSelector).should('not.exist')
  })
  // --- Events tests: register ---
  it('should emits register event', () => {
    const onRegisterSpy = cy.spy().as('onRegisterSpy')
    cy.mount(TextInput, { props: { onRegister: onRegisterSpy } })
    cy.get('@onRegisterSpy').should('have.been.calledOnceWith', Cypress.sinon.match((event) => {
      return event.type === 'REGISTER' && event.data.actor.constructor.name === 'Actor'
    }))
  })
  // --- Events tests: native ---
  it('should emits native events from input', () => {
    const onFocusSpy = cy.spy().as('onFocusSpy')
    cy.mount(TextInput, { props: { onFocus: onFocusSpy } })
    cy.get('input').focus()
    cy.get('@onFocusSpy').should('have.been.calledOnceWith', Cypress.sinon.match((event) => {
      return event.constructor.name === 'FocusEvent'
    }))
  })
})
