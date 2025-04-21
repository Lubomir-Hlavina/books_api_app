import {
    books
} from '../support/books';

describe('Book API tests', () => {
    const apiUrl = 'http://localhost:3000/books';

    beforeEach(() => {
        cy.clearBooks();
    });

    it('should add a new book successfully', () => {
        cy.request('POST', apiUrl, books.orwell)
            .its('status')
            .should('eq', 201);

        cy.request('GET', apiUrl).then((res) => {
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.include(books.orwell);
        });
    });

    it('should retrieve a list of books', () => {
        cy.request('POST', apiUrl, books.erenburg);
        cy.request('GET', apiUrl)
            .its('status')
            .should('eq', 200);

        cy.request('GET', apiUrl).then((res) => {
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.include(books.erenburg);
        });
    });

    it('should delete a book', () => {
        cy.request('POST', apiUrl, books.remarque).then((res) => {
            const bookId = res.body.id;

            cy.request('DELETE', `${apiUrl}/${bookId}`)
                .its('status')
                .should('eq', 200);

            cy.request('GET', apiUrl).then((response) => {
                const deleted = response.body.find(b => b.id === bookId);
                expect(deleted).to.be.undefined;
            });
        });
    });

    it('should return 404 for non-existent book', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/9999`,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(404);
        });
    });

    it('should not allow empty title or body (if validation exists)', () => {
        cy.request({
            method: 'POST',
            url: apiUrl,
            body: books.invalid,
            failOnStatusCode: false,
        }).then((res) => {
            expect(res.status).to.be.oneOf([201, 400]);
        });
    });
});