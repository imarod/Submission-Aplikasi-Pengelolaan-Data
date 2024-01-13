const incompleteBookshelfList = [];
const RENDER_EVENT = 'render-bookshelf ';
const SAVED_EVENT = 'saved-bookshelf ';
const STORAGE_KEY = 'BOOKSHELF_APPS';


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBookshelf();
    });
    if (isStorageExist()) {
        loadDataFromStorage()
    }
})

function addBookshelf() {
    const textBookshelf = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value
    const year = document.getElementById('inputBookYear').value;
    const checklist = document.getElementById('inputBookIsComplete').checked


    const generatedID = generateId();
    const bookshelfObject = generateBookshelfObject(generatedID, textBookshelf, authorBook, year, checklist);
    incompleteBookshelfList.push(bookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()

}


//fungsi
function generateId() {
    return +new Date();
}
//fungsi
function generateBookshelfObject(id, bookTitle, author, year, isCompleted) {
    return {
        id,
        bookTitle,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(incompleteBookshelfList);
    const unfinishedBOOKLIST = document.getElementById('incompleteBookshelfList')
    const finishedBOOKList = document.getElementById('completeBookshelfList')

    unfinishedBOOKLIST.innerHTML = ''
    finishedBOOKList.innerHTML = ''

    for (const bookshelfItem of incompleteBookshelfList) {
        const bookshelfElement = makeBookshelf(bookshelfItem)

        if (!bookshelfItem.isCompleted) {
            unfinishedBOOKLIST.append(bookshelfElement)
        }
        else {
            finishedBOOKList.append(bookshelfElement)
        }

    }

});
function makeBookshelf(bookshelfObject) {

    const textBookshelf = document.createElement('h2')
    textBookshelf.innerText = `Judul : ${bookshelfObject.bookTitle} `

    const textAuthor = document.createElement('h3')
    textAuthor.innerText = `Penulis: ${bookshelfObject.author}`

    const textYear = document.createElement('p')
    textYear.innerText = `Tahun : ${bookshelfObject.year}`

    const containerArticle = document.createElement('article')
    containerArticle.classList.add('book_item')
    containerArticle.append(textBookshelf, textAuthor, textYear)

    //undo button
    if (bookshelfObject.isCompleted) {
        const greenButton = document.createElement('button')
        greenButton.classList.add('green')
        greenButton.innerText = 'Belum selesai Baca'

        const containerButton = document.createElement('div')
        containerButton.classList.add('action')
        containerButton.append(greenButton)
        containerArticle.append(containerButton)

        greenButton.addEventListener('click', function () {
            undoBookFromCompleted(bookshelfObject.id)
        })

        const redButton = document.createElement('button')
        redButton.classList.add('red')
        containerButton.append(redButton)
        containerArticle.append(containerButton)
        redButton.innerText = 'Hapus'
        redButton.addEventListener('click', function () {
            removeBookFromCompleted(bookshelfObject.id)
        })


    } else {
        const greenButton = document.createElement('button')
        greenButton.classList.add('green')
        greenButton.innerText = 'Selesai baca'

        const containerButton = document.createElement('div')
        containerButton.classList.add('action')

        containerButton.append(greenButton)
        containerArticle.append(containerButton)

        greenButton.addEventListener('click', function () {
            addBookToCompleted(bookshelfObject.id)
        })

        const redButton = document.createElement('button')
        redButton.classList.add('red')
        redButton.innerText = 'Hapus'

        containerButton.append(redButton)
        containerArticle.append(containerButton)


        redButton.addEventListener('click', function () {
            removeBookFromCompleted(bookshelfObject.id)
        })
    }
    return containerArticle
}


function addBookToCompleted(bookshelfId) {
    const bookTarget = findBook(bookshelfId)

    if (bookTarget == null) return
    bookTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function findBook(bookshelfId) {
    for (const bookshelfItem of incompleteBookshelfList) {
        if (bookshelfItem.id === bookshelfId) {
            return bookshelfItem
        }
    }
    return null
}

function removeBookFromCompleted(bookshelfId) {
    const bookTarget = findBookIndex(bookshelfId)

    if (bookTarget === -1) return

    incompleteBookshelfList.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function undoBookFromCompleted(bookshelfId) {
    const bookTarget = findBook(bookshelfId)

    if (bookTarget === null) return

    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}


function findBookIndex(bookshelfId) {
    for (const index in incompleteBookshelfList) {
        if (incompleteBookshelfList[index].id === bookshelfId) {
            return index
        }
    }
    return -1
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(incompleteBookshelfList)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser Anda tidak mendukung local storage')
        return false
    }
    return true
}
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookshelf of data) {
            incompleteBookshelfList.push(bookshelf);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
