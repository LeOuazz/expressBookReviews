const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username exists and is not empty
  return username !== undefined && username.trim() !== '';
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Find user with matching username and password
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Task 7: Login as registered user
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign({username: username}, "access", {expiresIn: '1h'});
    
    // Save token in session
    req.session.authorization = {
      accessToken: token
    };
    
    return res.status(200).json({message: "Login successful", accessToken: token});
  } else {
    return res.status(401).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Task 8: Add or modify book review
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;
  
  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  if (!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  // Add or update the review
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({
    message: "Review added/updated successfully", 
    book: books[isbn]
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Task 9: Delete a book review
  const isbn = req.params.isbn;
  const username = req.user.username;
  
  if (!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "You haven't reviewed this book yet"});
  }
  
  // Delete the review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({
    message: "Review deleted successfully", 
    book: books[isbn]
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
