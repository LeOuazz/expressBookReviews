const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Task 6: Register a new user
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Task 1: Get all books
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Task 2: Get book by ISBN
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Task 3: Get books by author
  const author = req.params.author;
  const booksByAuthor = {};
  
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      booksByAuthor[isbn] = books[isbn];
    }
  });
  
  if (Object.keys(booksByAuthor).length === 0) {
    return res.status(404).json({message: `No books found by author: ${author}`});
  }
  
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Task 4: Get books by title
  const title = req.params.title;
  const booksByTitle = {};
  
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      booksByTitle[isbn] = books[isbn];
    }
  });
  
  if (Object.keys(booksByTitle).length === 0) {
    return res.status(404).json({message: `No books found with title: ${title}`});
  }
  
  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Task 5: Get book reviews
  const isbn = req.params.isbn;
  
  if (!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  return res.status(200).json(books[isbn].reviews);
});

// Task 10: Get all books (Promise version)
public_users.get('/promise/books', function (req, res) {
  const getAllBooks = new Promise((resolve, reject) => {
    try {
      resolve(JSON.stringify(books));
    } catch (error) {
      reject(error);
    }
  });

  getAllBooks
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({message: "Error getting books", error: error.message});
    });
});

// Task 11: Get book by ISBN (async/await version)
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Simulate asynchronous operation
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
          }
        }, 100);
      });
    };
    
    const book = await getBookByISBN();
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

// Task 12: Get books by author (Promise version)
public_users.get('/promise/author/:author', function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const booksByAuthor = {};
    
    setTimeout(() => {
      Object.keys(books).forEach(isbn => {
        if (books[isbn].author === author) {
          booksByAuthor[isbn] = books[isbn];
        }
      });
      
      if (Object.keys(booksByAuthor).length === 0) {
        reject(new Error(`No books found by author: ${author}`));
      } else {
        resolve(booksByAuthor);
      }
    }, 100);
  });
  
  getBooksByAuthor
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(404).json({message: error.message});
    });
});

// Task 13: Get books by title (async/await version)
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    
    // Function that returns a promise
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const booksByTitle = {};
        
        setTimeout(() => {
          Object.keys(books).forEach(isbn => {
            if (books[isbn].title === title) {
              booksByTitle[isbn] = books[isbn];
            }
          });
          
          if (Object.keys(booksByTitle).length === 0) {
            reject(new Error(`No books found with title: ${title}`));
          } else {
            resolve(booksByTitle);
          }
        }, 100);
      });
    };
    
    const result = await getBooksByTitle();
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

module.exports.general = public_users;
