document.addEventListener("DOMContentLoaded", function() {

  const bookURL = `http://localhost:3000/books/`
  const usersURL = `http://localhost:3000/users/`
  const userOne = {"id":1, "username":"pouros"}
  const bookList = document.getElementById('list')
  const showPanel = document.getElementById('show-panel')
  let allBooks = []

  const getBooks = () => {
    fetch(bookURL)
      .then(response => response.json())
      .then(data => {
        showBooks(data);
        allBooks = data
      })
  }

  const showBooks = (books) => {
    bookList.innerHTML = ''
    books.forEach(book => {
      bookList.innerHTML += `
        <li data-id='${book.id}'>${book.title}</li>
      `
    })
  }

  const showOneBook = (book) => {
    let heartEmoji
    if (containsUser(book.users)) {
      heartEmoji = '❤️'
    } else {
      heartEmoji = '🖤'
    }
    showPanel.innerHTML = `
      <h2>${book.title}</h2>
      <img src='${book.img_url}'>
      <hr>
      <p>${book.description}</p>
      <hr>
      <button data-id='${book.id}'>${heartEmoji}</button>
      <h3>Liked by:</h3>
      <ul>
    `
    book.users.forEach(user => {
      showPanel.innerHTML += `
        <li>${user.username}</li>
      `
    })
    showPanel.innerHTML += `</ul>`
  }

  const likeBook = (book) => {
    if (!containsUser(book.users)) {
      book.users.push(userOne)
    } else {
      console.log('You like this book!');
      book.users = book.users.filter(user => {
        return user.id != 1
      })
    }
    showOneBook(book)
    console.log(book.users);
    updateLikes(book)
  }

  const updateLikes = (book) => {
    fetch((bookURL + book.id), {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body: JSON.stringify({
        users: book.users
      })
    })
    .then(getBooks)
  }

  const findBook = (event) => {
    let foundBook = allBooks.find(book => {
      return book.id == event.target.dataset.id
    })
    return foundBook
  }

  const containsUser = (usersArray) => {
    let filteredArray = usersArray.filter(user => {
      return user.id == 1
    })
    if (filteredArray.length == 0) {
      return false
    } else {
      return true
    }
  }

  bookList.addEventListener('click', (event) => {
    let clickedBook = findBook(event)
    showOneBook(clickedBook)
  })

  showPanel.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      let likedBook = findBook(event)
      likeBook(likedBook)
    }
  })



  getBooks()

});
