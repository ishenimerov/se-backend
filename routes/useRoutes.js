const express = require('express');
const { getUsers, deleteUser, updateUser } = require('../controllers/userController');
const { getPosts } = require('../controllers/postController');
const { signIn } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.get('/posts', getPosts);
router.post('/signin', signIn);

module.exports = router;
