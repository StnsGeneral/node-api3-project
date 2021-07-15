const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model.js');
const Posts = require('../posts/posts-model');

// The middleware functions also need to be required
const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware.js');

const router = express.Router();

// RETURN AN ARRAY WITH ALL THE USERS
router.get('/', (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the users!',
      });
    });
});

// RETURN THE USER OBJECT
// this needs a middleware to verify user id
router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getById(id);
  res.status(200).json(req.user);
});

// RETURN THE NEWLY CREATED USER OBJECT
// this needs a middleware to check that the request body is valid
router.post('/', validateUser, (req, res) => {
  const newUser = req.body;
  Users.insert(newUser).then((newUser) => {
    res.status(201).json(newUser);
  });
});

// RETURN THE FRESHLY UPDATED USER OBJECT
// this needs a middleware to verify user id
// and another middleware to check that the request body is valid
router.put('/:id', validateUserId, validateUser, async (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  const updatedUser = await Users.update(id, changes);

  res.status(201).json(updatedUser);
});

// RETURN THE FRESHLY DELETED USER OBJECT
// this needs a middleware to verify user id
router.delete('/:id', validateUserId, async (req, res) => {
  const { id } = req.params;
  Users.getById(id).then((user) => {
    Users.remove(id).then((deletedUser) => {
      res.status(200).json(user);
    });
  });
});

// RETURN THE ARRAY OF USER POSTS
// this needs a middleware to verify user id
router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'user not found' });
      } else {
        res.status(201).json(user);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving user posts',
      });
    });
});

// RETURN THE NEWLY CREATED USER POST
// this needs a middleware to verify user id
// and another middleware to check that the request body is valid
router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const updatedPost = await Posts.insert({
    user_id: req.params.id,
    text: req.body.text,
  });
  res.status(201).json(updatedPost);
});

// do not forget to export the router

module.exports = router;
