import UiButton from './UiButton.vue'

describe('<UiButton />', () => {
  it('renders', () => {
    cy.mount(UiButton)
  })
  // --- Props tests: size ---
  it('fits the specified size', () => {
    const sizes = [{
      height: 56,
      minWidth: 136,
      size: undefined
    }, {
      height: 56,
      minWidth: 136,
      size: 'l'
    }, {
      height: 48,
      minWidth: 96,
      size: 'm'
    }, {
      height: 36,
      minWidth: 80,
      size: 's'
    }, {
      height: 28,
      minWidth: 72,
      size: 'xs'
    }]
    for (const { size, height, minWidth } of sizes) {
      cy.mount(UiButton, {
        props: { size }
      })
      cy.get('button')
        .should('have.css', 'height', height + 'px')
        .should('have.css', 'min-width', minWidth + 'px')
    }
  })
  // --- Props tests: label ---
  it('render label', () => {
    const label = 'Label'
    cy.mount(UiButton)
    cy.get('button').should('be.empty')
    cy.mount(UiButton, {
      props: { label }
    })
    cy.get('button').should('have.text', label)
  })
  // --- Props tests: state ---
  it('have disabled state', () => {
    cy.mount(UiButton)
    cy.get('button').should('not.be.disabled')
    cy.mount(UiButton, {
      props: { state: 'disabled' }
    })
    cy.get('button').should('be.disabled')
  })
  // --- Props tests: style ---
  it('matches the specified style', () => {
    const styles = [{
      backgroundColor: '#0017C1',
      style: undefined
    }, {
      backgroundColor: '#0017C1',
      style: 'primary'
    }, {
      backgroundColor: '#FFFFFF',
      style: 'secondary'
    }, {
      backgroundColor: 'none',
      style: 'tertiary'
    }]
    for (const { style, backgroundColor } of styles) {
      cy.mount(UiButton, {
        props: { style }
      })
      if(backgroundColor === 'none') {
        cy.get('button')
          .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
      } else {
        cy.get('button')
          .should('have.css', 'background-color')
          .and('be.colored', backgroundColor)
      }
    }  
  })
})