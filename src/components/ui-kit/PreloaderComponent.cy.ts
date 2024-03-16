import PreloaderComponent from '@/components/ui-kit/PreloaderComponent.vue'

describe('<PreloaderComponent />', () => {
  it('renders', () => {
    cy.mount(PreloaderComponent)
  })
  it('render slot', () => {
    const rootSelector = '.ui-preloader-component'
    const slotText = 'Test-text'
    cy.mount(PreloaderComponent, {
      slots: {
        default: slotText
      }
    })
    cy.get(rootSelector)
      .should('have.text', slotText)
  })
  // --- Props tests: renderAs ---
  it('render root as specified', () => {
    const rootSelector = '.ui-preloader-component'
    const slotText = 'Test-text'
    cy.mount(PreloaderComponent, {
      slots: {
        default: slotText
      }
    })
    cy.get('div' + rootSelector)
      .should('exist')
    cy.mount(PreloaderComponent, {
      slots: {
        default: slotText
      },
      props: { renderAs: 'form' }
    })
    cy.get('form' + rootSelector)
      .should('exist')
  })
  // --- Props tests: loading ---
  it('loading state renders', () => {
    const overlaySelector = '.ui-preloader-component__overlay'
    const spinnerSelector = '.ui-preloader-component__spinner'
    const slotText = 'Test-text'
    cy.mount(PreloaderComponent, {
      slots: {
        default: slotText
      }
    })
    cy.get(overlaySelector)
      .should('not.exist')
    cy.get(spinnerSelector)
      .should('not.exist')

    cy.mount(PreloaderComponent, {
      slots: {
        default: slotText
      },
      props: { loading: true }
    })
    cy.get(overlaySelector)
      .should('be.visible')
    cy.get(overlaySelector)
      .should('have.css', 'background-color', 'rgba(255, 255, 255, 0.5)')

    cy.get(spinnerSelector)
      .should('be.visible')
      .and('have.prop', 'naturalWidth')
      .should('be.greaterThan', 0)
  })
})
