const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";


// CHECK LOCAL STORAGE
function checkForStorage() {
    return typeof(Storage) !== "undefined";
}

// GENERATE BOOK.id
function generateId(){
    return +new Date();
}
 
// GENERATE Book object to be saved
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

// GET ALL BOOK OBJECT
function getBookshelf(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const bookData = JSON.parse(serializedData);
    
    if(bookData !== null){
        for(book of bookData){
            books.push(book);
        }
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}


// RENDER BOOK object to HTML
function renderBookItem(book) {
    const titleEl = document.createElement("h3");
    titleEl.innerText = book.title;

    const authorEl = document.createElement("p");
    authorEl.innerText = "Author : " + book.author;
    authorEl.classList.add('book-author');

    const yearEl = document.createElement("p");
    yearEl.innerText = "Year : " + book.year;
    yearEl.classList.add('book-year');

    let greenBtn;
    let redBtn;
    if(book.isCompleted){
        greenBtn = renderButton("green-btn", "Belum Selesai");
        redBtn = renderButton("red-btn", "Hapus Buku");
    }else {
        greenBtn = renderButton("green-btn", "Selesai Dibaca");
        redBtn = renderButton("red-btn", "Hapus Buku");
    }

    greenBtn.addEventListener("click",function(){
        changeBookState(book.id);
    });
    
    redBtn.addEventListener("click", function(){
        removeBook(book.id);
    });
    
     //create button inside article
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");
    
    //append button to action div
    actionDiv.append(greenBtn,redBtn);
    
    const bookArticle = document.createElement("article");
    bookArticle.classList.add("book-item");
    bookArticle.setAttribute("id",book.id);
    
    //append all in book-article 
    bookArticle.append(titleEl,authorEl, yearEl,actionDiv);
    return bookArticle;
}

// RENDED BUTTON FOR BOOK ITEM
function renderButton(typeClass, buttonText){
    const button = document.createElement("button");
    button.classList.add(typeClass);
    button.innerText = buttonText;
    return button;
}

// RENDER ALL BOOKS
document.addEventListener(RENDER_EVENT, function (){
    const completedBookshelf = document.getElementById("completedBookshelf");
    const incompleteBookshelf = document.getElementById("incompletedBookshelf");
    
    completedBookshelf.innerHTML = "";
    incompleteBookshelf.innerHTML = "";
    
    for(book of books){
        const bookElement = renderBookItem(book);
        if(book.isCompleted){
            completedBookshelf.append(bookElement);
        }else{
            incompleteBookshelf.append(bookElement);
        }
    }
});

// CREATE NEW BOOK
function createNewBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    
    const generatedID = generateId();
    let checked = false;
    if(document.getElementById("inputBookIsComplete").checked){
        checked = true;
    }
    
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, checked);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}


document.addEventListener("DOMContentLoaded", function(){
    const submitInsertBook = document.getElementById("createNewBook");
    
    submitInsertBook.addEventListener("submit", function(event) {
        event.preventDefault(); 
        createNewBook();
        alert("Buku Telah Ditambahkan");
    });
    
    if(checkForStorage()){
        getBookshelf();
    }
});


// REMOVE BOOK
function removeBook(bookId){
    const bookTarget = searchBook(bookId);
    console.log(bookTarget);
    if(bookTarget === -1) return;
    let confirmation = confirm("Apakah Anda ingin Menghapus buku " + bookTarget.title + "?");
    if(confirmation == true){
        bookTargetIndex = books.findIndex(Object => {
            return Object.id === bookTarget.id  
        });
        console.log(bookTargetIndex);
        books.splice(bookTargetIndex, 1);
        alert("Buku Telah Dihapus");
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}

// CHANGE BOOK STATE (completed to incompleted or vice versa)
function changeBookState(bookId){
    const bookTarget = searchBook(bookId);
    if(bookTarget == null) return;
    
    if(bookTarget.isCompleted){
        bookTarget.isCompleted = false;
    } else {
        bookTarget.isCompleted = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
    alert("Buku Telah Dipindahkan");
}

// SAVE BOOK TO LOCALSTORAGE
function saveBook(){
    if(checkForStorage()){
        const parsedBooks = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsedBooks);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log("Data berhasil di simpan.");
});


function searchBook(bookId){
    for(book of books){
        if(book.id === bookId){
            return book;
        }
    }
    return null;
}

function searchBookByTitle(bookTitle){
    for(book of books){
        if(book.title.toLowerCase() === bookTitle.toLowerCase()){
            return book;
        }
    }
    return null;
}

function renderSearchBook(bookTitle){
    const showBookDiv = document.getElementById("searchResult");
    showBookDiv.innerHTML = "";
    const book = searchBookByTitle(bookTitle);
    if(book){    
        const bookElement = renderBookItem(book);
        showBookDiv.append(bookElement);
        console.log(bookTitle + " Found!");
    }else {
        const notFoundElement = document.createElement("article");
        notFoundElement.classList.add("book-item");
        notFoundElement.innerHTML = "<h3>Book Not Found!!!</h3>";
        showBookDiv.append(notFoundElement);
        console.log("book not found");
    }
}


const submitSearchBook = document.getElementById("searchBook");
submitSearchBook.addEventListener("submit", function(event){
    const bookTitle = document.getElementById("searchBookTitle").value;
    console.log(bookTitle);
    renderSearchBook(bookTitle);
    event.preventDefault();
});