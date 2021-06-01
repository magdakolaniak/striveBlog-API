import express from 'express';
import createError from 'http-errors';
import postModel from './schema.js';

const postsRouter = express.Router();

postsRouter.get('/', async (req, res, next) => {
  try {
    const blogPosts = await postModel.find();
    res.send(blogPosts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

postsRouter.post('/', async (req, res, next) => {
  try {
    const newBlogPost = new postModel(req.body);
    const { _id } = await newBlogPost.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      next(createError(400, error));
    } else {
      next(createError(500, 'An error occurred while saving student'));
    }
  }
});
export default postsRouter;
