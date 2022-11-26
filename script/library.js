let myLibrary = [];

class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

// GET BOOKS FROM LOCAL STORAGE
if (localStorage.getItem('books') === null) {
    myLibrary = [];
} else {
    const booksFromStorage = JSON.parse(localStorage.getItem('books'));
    myLibrary = booksFromStorage;
}

// Display books information  
function showLibraryInfo() {
    const booksRead = document.querySelector('#books-read');
    const booksUnread = document.querySelector('#books-unread');
    const totalBooks = document.querySelector('#total-books');
    const totalBooks2 = document.querySelector('.total-books');
    let readCounter = 0;
    let unreadCounter = 0;
    booksRead.textContent = 0;
    booksUnread.textContent = 0;
    for (let i = 0; i < myLibrary.length; i += 1) {
        if (myLibrary[i].status === true) {
            readCounter += 1;
            booksRead.textContent = readCounter;
        } else if (myLibrary[i].status === false) {
            unreadCounter += 1;
            booksUnread.textContent = unreadCounter;
        }
    }
    totalBooks.textContent = myLibrary.length;
    totalBooks2.textContent = myLibrary.length;
}

function showBooksInLibrary() {
    // SAVE TO LOCAL STORAGE
    localStorage.setItem('books', JSON.stringify(myLibrary));
    showLibraryInfo();
    const bookList = document.querySelector('#table-body');
    bookList.textContent = '';
    for (let i = 0; i < myLibrary.length; i += 1) {
        const bookRow = document.createElement('tr');
        bookRow.classList.add('book-info');
        bookList.appendChild(bookRow);
        // BOOK TITLE
        const bookTitle = document.createElement('td');
        bookTitle.textContent = myLibrary[i].title;
        bookRow.appendChild(bookTitle);
        // BOOK AUTHOR
        const bookAuthor = document.createElement('td');
        bookAuthor.textContent = myLibrary[i].author;
        bookRow.appendChild(bookAuthor);
        // BOOK PAGES
        const bookPages = document.createElement('td');
        bookPages.textContent = myLibrary[i].pages;
        bookRow.appendChild(bookPages);
        // BOOK STATUS BUTTON
        const bookStatus = document.createElement('td');
        const statusSymbol = document.createElement('i');
        if (myLibrary[i].status === false) {
            statusSymbol.classList.add('fas', 'fa-times');
        } else {
            statusSymbol.classList.add('fas', 'fa-check');
        }
        bookStatus.appendChild(statusSymbol);
        bookRow.appendChild(bookStatus);
        // BOOK REMOVAL BUTTON
        const bookDelete = document.createElement('td');
        const deleteSymbol = document.createElement('i');
        deleteSymbol.classList.add('fas', 'fa-trash');
        bookDelete.appendChild(deleteSymbol);
        bookRow.appendChild(bookDelete);
    }
}

function addBookToLibrary(title, author, pages, status) {
    const book = new Book(title, author, pages, status);
    let matches = 0;
    for (let i = 0; i < myLibrary.length; i++) {
        let libraryBook = myLibrary[i];
        if (book.title === libraryBook.title && book.author === libraryBook.author ) {
            matches += 1;
        }    
    }
    if (matches > 0) {
        UI.showAlert('Book is in the library', 'delete')
    } else {
        myLibrary.push(book);
        UI.showAlert('Book Added', 'success');
    }
    showBooksInLibrary();
}

// FORM VALIDATION
function validateForm(event) {
    event.preventDefault();
    const form = document.querySelector('form');
    const titleInput = document.querySelector('#title');
    const titleErr = document.querySelector('.title');
    const nameInput = document.querySelector('#name');
    const nameErr = document.querySelector('.name');
    const numberInput = document.querySelector('#number');
    const numberErr = document.querySelector('.number');
    const checkbox = document.querySelector('input[name="checkbox"]');
    if (titleInput.value === '') {
        titleErr.style.display = 'block';
    } else {
        titleErr.style.display = 'none';
    }
    if (nameInput.value === '') {
        nameErr.style.display = 'block';
    } else {
        nameErr.style.display = 'none';
    }
    if (numberInput.value === '' || numberInput.value.match(/[^1-9]/) || numberInput.value <= 0) {
        numberErr.style.display = 'block';
    } else {
        numberErr.style.display = 'none';
    }
    if (titleInput.value !== '' && nameInput.value !== '' && numberInput.value !== '' && numberInput.value > 0) {
        if (checkbox.checked) {
            addBookToLibrary(titleInput.value, nameInput.value, numberInput.value, true);
        } else {
            addBookToLibrary(titleInput.value, nameInput.value, numberInput.value, false);
        }
        form.reset();
        modal.style.display = "none"
    }
}

function listenClicks() {
    document.addEventListener('click', (event) => {
        const { target } = event;
        const tr = target.parentNode.parentNode.rowIndex - 1;
        if (target.id === 'add-book') {
            validateForm(event);
        } else if (target.classList.contains('fa-trash')) {
            myLibrary.splice(tr, 1);
            UI.showAlert('Book Deleted', 'delete')
        } else if (target.classList.contains('fa-check')) {
            target.classList.remove('fa-check');
            target.classList.add('fa-times');
            myLibrary[tr].status = false;
        } else if (target.classList.contains('fa-times')) {
            target.classList.remove('fa-times');
            target.classList.add('fa-check');
            myLibrary[tr].status = true;
        }
        showBooksInLibrary();
    });
}
class UI {
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `msg msg-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.banner-middle');
        const form = document.querySelector('#msg-text');
        container.insertBefore(div, form);

        //Vanish in 3 Seconds
        setTimeout(() => {
            document.querySelector('.msg').remove()
        }, 2000);
    }
}


showBooksInLibrary();
listenClicks();
