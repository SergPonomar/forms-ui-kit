import { h } from 'vue'
import SubmitButton from '@/components/form/SubmitButton.vue'
import LogMachine from '@/story/LogMachine.vue'

describe('<SubmitButton />', () => {
  it('renders', () => {
    cy.mount(SubmitButton)
  })
  // --- Click event test ---
  it('send event to machine', () => {
    const onMachineEventSpy = cy.spy().as('onMachineEventSpy')
    // cy.mount(SubmitButton)
    cy.mount(LogMachine, {
      slots: {
        default: SubmitButton
      },
      props: { onMachineEvent: onMachineEventSpy }
    })
    cy.get('button').click()
    cy.get('@onMachineEventSpy').should('have.been.calledWith', {
      type: 'TRYSUBMIT'
    })

    cy.mount(LogMachine, {
      slots: {
        default: h(SubmitButton, { next: true })
      },
      props: { onMachineEvent: onMachineEventSpy }
    })
    cy.get('button').click()
    cy.get('@onMachineEventSpy').should('have.been.calledWith', {
      type: 'TRYNEXT'
    })
  })

  // --- Disabled test ---
  it('disabled if machine on error state', () => {
    cy.mount(LogMachine, {
      slots: {
        default: SubmitButton
      },
      props: { state: 'error' }
    })
    cy.get('button').should('have.attr', 'disabled')
  })
})
