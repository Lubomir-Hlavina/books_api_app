const apiUrl = 'http://localhost:3000/books';

const addBookForm = document.getElementById('add-book-form');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const bookList = document.getElementById('book-list');


async function fetchBooks() {
    const response = await fetch(apiUrl);
    const books = await response.json();

    bookList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.setAttribute('data-cy', 'book-item');
        li.textContent = `${book.title} by ${book.body}`;

        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.setAttribute('data-cy', 'delete-book-button');
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', () => deleteBook(book.id));

        li.appendChild(deleteBtn);
        bookList.appendChild(li);
    });
}


addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const book = {
        title: bookTitleInput.value,
        body: bookAuthorInput.value,
    };

    await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(book),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetchBooks();
    addBookForm.reset();
});


async function deleteBook(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });

    fetchBooks(); 
}

fetchBooks();