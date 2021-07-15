const Users = require('../users/users-model');

function logger(req, res, next) {
  console.log(
    `Method: '${req.method}' called on the '${
      req.url
    }' endpoint, at [${new Date().toLocaleString()}]`
  );
  next();
}

const validateUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.getById(id);
    if (!user) {
      res.status(404).json({ message: 'user not found' });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: `Error ${error}` });
  }
};

function validateUser(req, res, next) {
  try {
    const user = req.body;
    if (!user.name) {
      res.status(400).json({ message: 'missing required name field' });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

function validatePost(req, res, next) {
  try {
    const post = req.body;
    if (!post.text) {
      res.status(400).json({ message: 'missing required text field' });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
