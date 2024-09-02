describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://smartbrain-16fq.onrender.com/')

    cy.get('[data-cy="cypress-test"]').should('exist');
  })
})