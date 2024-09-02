describe('template spec', () => {
  const imageURLs = [
    'https://upload.wikimedia.org/wikipedia/commons/2/2a/Human_faces.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/6b/Old_man_face.jpg',
    'https://freerangestock.com/sample/127295/face-of-old-man-.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/8/86/My_Favourite_Faces_%28Imagicity_640%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/a0/Pierre-Person.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/0a/Robert_Downey_Jr_avp_Iron_Man_3_Paris.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/25/Chris_Pratt_%2843004432134%29_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/Daisy_Ridley_Our_Movie_Guide_2024.png',
    'https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg'
  ];
  it('passes', () => {
    cy.intercept('POST', '**/signin').as('signinRequest')
    //Goes to local development website
    cy.visit('http://localhost:3000')
    //Quick test
    cy.get('[data-cy="cypress-test"]').should('exist');
    /*
    Goal: Go to input boxes and put email and password
    */
    cy.get('[data-cy="cypress-signin-email"]').type('john1@gmail.com')
    cy.get('[data-cy="cypress-signin-password"]').type('cookies')
    //Click the signin button
    cy.get('[data-cy="cypress-signin-button"]').click()
    cy.wait('@signinRequest').its('response.statusCode').should('eq', 200)
    /*
    Goal: Get imagelinkform, input image, then click detect button
    */
    imageURLs.forEach((url) => {
      cy.intercept('PUT', '**/image').as('imagePutRequest');
      cy.get('[data-cy="cypress-image-url"]').clear().type(url)
      cy.get('[data-cy="cypress-image-button"]').click()
      cy.wait('@imagePutRequest').its('response.statusCode').should('eq',200)
      cy.wait(4000);
    })
   
  })
})