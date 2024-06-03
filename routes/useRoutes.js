const express = require('express');
const { getUsers, deleteUser, updateUser, createUser } = require('../controllers/userController');
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const { signIn } = require('../controllers/auth.controller');

const router = express.Router();

//Post
router.get('/posts', getPosts);
router.post('/posts/create', createPost);
router.delete('/posts/:id', deletePost);

//User
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.post('/users', createUser)

//Category


//Auth
router.post('/signin', signIn);

module.exports = router;
