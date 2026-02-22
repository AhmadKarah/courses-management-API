const express = require('express');
const multer = require('multer');
const appError = require('../utils/appError');

const diskStrorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];

  if (imageType === 'image') {
    return cb(null, true);
  } else {
    return cb(appError.create('the file must be an image', 400), false);
  }
};

const upload = multer({
  storage: diskStrorage,
  fileFilter,
});
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

const usersController = require('../controllers/users.controller');

router.route('/').get(verifyToken, usersController.getAllUsers);

router.route('/register').post(upload.single('avatar'), usersController.register);

router.route('/login').post(usersController.login);

module.exports = router;
