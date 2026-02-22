const { validationResult } = require('express-validator');
const Course = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseID, { __v: false });

  if (!course) {
    const error = appError.create('course not found', 404, httpStatusText.FAIL);
    return next(error);
  }

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);

  await newCourse.save();

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.courseID;

  const updatedCourse = await Course.findByIdAndUpdate(courseID, { $set: { ...req.body } }, { new: true });

  if (!updatedCourse) {
    const error = appError.create('course not found', 404, httpStatusText.FAIL);
    return next(error);
  }

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const result = await Course.deleteOne({ _id: req.params.courseID });

  if (result.deletedCount === 0) {
    const error = appError.create('course not found', 404, httpStatusText.FAIL);
    return next(error);
  }

  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
