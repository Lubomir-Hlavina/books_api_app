describe('Book App UI', () => {
    const apiUrl = 'http://localhost:3000/books';

    beforeEach(() => {
        // Cleans backend
        cy.request('GET', apiUrl).then((res) => {
            res.body.forEach((book) => {
                cy.request('DELETE', `${apiUrl}/${book.id}`);
            });
        });

        cy.visit('http://localhost:5500');
    });

    it('adds a new book via form and shows it in list', () => {
        cy.get('[data-cy=book-title]').type('1984');
        cy.get('[data-cy=book-author]').type('George Orwell');
        cy.get('[data-cy=submit-button]').click();

        cy.get('[data-cy=book-item]').should('have.length', 1);
        cy.get('[data-cy=book-item]').first().should('contain', '1984').and('contain', 'George Orwell');
    });

    it('removes a book from the list', () => {
        cy.get('[data-cy=book-title]').type('Test Kniha');
        cy.get('[data-cy=book-author]').type('Test Autor');
        cy.get('[data-cy=submit-button]').click();

        cy.get('[data-cy=book-item]').should('have.length', 1);
        cy.get('[data-cy=delete-book-button]').click();

        cy.get('[data-cy=book-item]').should('have.length', 0);
    });

    it('does not add a book with empty inputs', () => {
        cy.get('[data-cy=submit-button]').click();

        // json-server to síce pridá, ale frontend by mal zabrániť
        cy.get('[data-cy=book-item]').should('have.length', 0);
    });
});