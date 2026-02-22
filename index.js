const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoose = require('mongoose');

const httpStatusText = require('./utils/httpStatusText');

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log('mongoDB server started');
});

app.use(cors());
app.use(express.json());

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

app.all(/(.*)/, (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: 'this resource is not available',
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log('MONGO_URL from Env:', process.env.MONGO_URL ? 'Exists' : 'Missing');
  console.log('JWT_SECRET from Env:', process.env.JWT_SECRET_KEY ? 'Exists' : 'Missing');
  console.log('Server is running on port 4000');
});
