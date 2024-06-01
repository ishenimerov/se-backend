const express = require('express');
const { getUsers } = require('../controllers/userController');
const { getPosts } = require('../controllers/postController');

const router = express.Router();

router.get('/users', getUsers);
router.get('/posts', getPosts);

module.exports = router;