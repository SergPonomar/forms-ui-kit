import { h } from 'vue'
import InjectionTester from '#root/cypress/support/InjectionTester.vue'
import FormComponent from '@/components/form/FormComponent.vue'
import SubmitButton from '@/components/form/SubmitButton.vue'
import TextInput from '@/components/form/TextInput.vue'

describe('<FormComponent />', () => {
  it('renders', () => {
    cy.mount(FormComponent)
  })
  it('render slot', () => {
    const slotText = 'Test-text'
    cy.mount(FormComponent, {
      slots: {
        default: slotText
      }
    })
    cy.get('form')
      .should('have.text', slotText)
  })
  // --- Props tests: name ---
  it('set form name', () => {
    const name = 'test-form-name'
    cy.mount(FormComponent)
    cy.get('form').should('not.have.attr', 'name')
    cy.mount(FormComponent, {
      props: { name }
    })
    cy.get('form').should('have.attr', 'name', name)
  })
  // --- Props tests: numberOfSteps ---
  it('set number of steps', () => {
    const numberOfSteps = 5
    cy.mount(FormComponent, {
      props: {
        url: '/test',
        numberOfSteps
      },
      slots: {
        default: (slotProps: { numberOfSteps: number | undefined }) => h('div', { id: 'slot-props' }, slotProps.numberOfSteps)
      }
    })
    cy.get('#slot-props').should('have.text', numberOfSteps)
  })
  // --- Props tests: url ---
  it('set request url', () => {
    const url = 'https://sergponomar-form-demo.builtwithdark.com/form-test'
    cy.mount(FormComponent, {
      props: {
        url
      },
      slots: {
        default: h(SubmitButton)
      }
    })
    cy.intercept(url).as('request')
    cy.get('button').click()
    cy.wait('@request').its('response.url').should('eq', url)
  })
  it('set request method', () => {
    const url = 'https://sergponomar-form-demo.builtwithdark.com/form-test'
    // default method (post)
    cy.mount(FormComponent, {
      props: {
        url
      },
      slots: {
        default: h(SubmitButton)
      }
    })
    cy.intercept(url).as('request-post')
    cy.get('button').click()
    cy.wait('@request-post').its('request.method').should('eq', 'POST')
    // provided method
    const method = 'GET'
    cy.mount(FormComponent, {
      props: {
        url,
        method
      },
      slots: {
        default: h(SubmitButton)
      }
    })
    cy.intercept(url).as('request-get')
    cy.get('button').click()
    cy.wait('@request-get').its('request.method').should('eq', method)
  })
  // --- Provider tests: formName ---
  it('provide formName', () => {
    const formName = 'test-form-name'
    const onInjectedSpy = cy.spy().as('onInjectedSpy')
    cy.mount(FormComponent, {
      props: {
        url: '/test',
        name: 'test-form-name'
      },
      slots: {
        default: h(InjectionTester, { injection: 'formName', onInjected: onInjectedSpy })
      }
    })
    cy.get('@onInjectedSpy').should('have.been.calledOnceWith', formName)
  })
  // --- Provider tests: machine actor ---
  it('provide machine actor', () => {
    const onInjectedSpy = cy.spy().as('onInjectedSpy')
    cy.mount(FormComponent, {
      props: {
        url: '/test',
        name: 'test-form-name'
      },
      slots: {
        default: h(InjectionTester, { injection: 'formActor', onInjected: onInjectedSpy })
      }
    })
    cy.get('@onInjectedSpy').should('have.been.calledOnceWith', Cypress.sinon.match((payload) => {
      return payload.constructor.name === 'Actor'
    }))
  })
  // --- Event emition tests: done ---
  it('emit done on successful request', () => {
    const url = 'https://sergponomar-form-demo.builtwithdark.com/form-test/success'
    const successResponse = { message: 'success' }
    const onDoneSpy = cy.spy().as('onDoneSpy')
    cy.mount(FormComponent, {
      props: {
        url,
        onDone: onDoneSpy
      },
      slots: {
        default: h(SubmitButton)
      }
    })
    cy.intercept(url).as('request')
    cy.get('button').click()
    cy.wait('@request').then((interseption) => {
      expect(interseption.response).to.have.property('statusCode').and.eq(200)
      expect(interseption.response).to.have.property('body').and.deep.equal(successResponse)
    })
    cy.get('@onDoneSpy').should('have.been.calledOnceWith', successResponse)
  })
  // --- Event emition tests: error ---
  it('emit error on unsuccessful request', () => {
    const url = 'https://sergponomar-form-demo.builtwithdark.com/form-test/error'
    const errorResponse = { errors: { field1: 'Ошибка в поле 1' } }
    const onErrorSpy = cy.spy().as('onErrorSpy')
    cy.mount(FormComponent, {
      props: {
        url,
        onError: onErrorSpy
      },
      slots: {
        default: h(SubmitButton)
      }
    })
    cy.intercept(url).as('request')
    cy.get('button').click()
    cy.wait('@request').then((interseption) => {
      expect(interseption.response).to.have.property('statusCode').and.eq(422)
      expect(interseption.response).to.have.property('body').and.deep.equal(errorResponse)
    })
    cy.get('@onErrorSpy').should('have.been.calledOnceWith', Cypress.sinon.match((payload) => {
      return JSON.stringify(payload.response.data) === JSON.stringify(errorResponse)
    }))
  })
  // --- Send proper body ---
  it('send proper request body', () => {
    const url = 'https://sergponomar-form-demo.builtwithdark.com/form-test'
    const inputText = 'field1 input text'
    const inputName = 'field1'
    const expectedBody = { [inputName]: inputText }
    cy.mount(FormComponent, {
      props: {
        url,
        name: 'test-form-name'
      },
      slots: {
        default: [h(TextInput, { name: inputName }), h(SubmitButton)]
      }
    })
    cy.intercept(url).as('request')
    cy.get('input').focus().type(inputText).blur()
    cy.get('button').click()
    cy.wait('@request').its('request.body').should('deep.equal', expectedBody)
  })
})
