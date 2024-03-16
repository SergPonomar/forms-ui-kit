import PreviousButton from '@/components/form/PreviousButton.vue'
import LogMachine from '@/story/LogMachine.vue'

describe('<PreviousButton />', () => {
  it('renders', () => {
    cy.mount(PreviousButton)
  })
  // --- Click event test ---
  it('send event to machine', () => {
    const onMachineEventSpy = cy.spy().as('onMachineEventSpy')
    // cy.mount(PreviousButton)
    cy.mount(LogMachine, {
      slots: {
        default: PreviousButton
      },
      props: { onMachineEvent: onMachineEventSpy }
    })
    cy.get('button').click()
    cy.get('@onMachineEventSpy').should('have.been.calledOnceWith', {
      type: 'PREVIOUS'
    })
  })
})
