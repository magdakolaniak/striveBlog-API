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

postsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const blogPost = await postModel.findById(id);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `Post with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error occurde while getting blogs'));
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
postsRouter.put('/:id', async (req, res, next) => {
  try {
    const blogPost = await postModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `Post with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error occured while trying to modify post'));
  }
});
postsRouter.delete('/:id', async (req, res, next) => {
  try {
    const blogPost = await postModel.findByIdAndDelete(req.params.id);
    if (blogPost) {
      res.status(204).send();
    } else {
      next(createError(404, `Post with id: ${req.params.id} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error occured while trying to delete a post'));
  }
});

export default postsRouter;
