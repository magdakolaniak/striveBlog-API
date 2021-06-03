import express from 'express';
import createError from 'http-errors';
import postModel from './schema.js';
import q2m from 'query-to-mongo';
const postsRouter = express.Router();

postsRouter.get('/', async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await postModel.countDocuments(query.criteria);
    const blogPosts = await postModel
      .find(query.criteria, query.options.fields)
      .populate('authors')
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send({ links: query.links('/blogPosts', total), total, blogPosts });
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

// ----------------------------COMMENTS PART--------------------------//

postsRouter.get('/:id/comments/', async (req, res, next) => {
  try {
    const blogPost = await postModel.findById(req.params.id, {
      comments: 1,
      _id: 0,
    });
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(createError(404, `Blog with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while getting comments'));
  }
});

postsRouter.get('/:id/comments/:commentId', async (req, res, next) => {
  try {
    const blogPost = await postModel.findOne(
      {
        _id: req.params.id,
      },
      {
        comments: {
          $elemMatch: { _id: req.params.commentId },
        },
      }
    );
    if (blogPost) {
      const { comments } = blogPost;
      if (comments && comments.length > 0) {
        res.send(comments[0]);
      } else {
        next(
          createError(
            404,
            `Comment with id: ${req.params.commentId} not found in this blog`
          )
        );
      }
    } else {
      next(createError(404, `Blog with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while looking for comments'));
  }
});
postsRouter.post('/:id/comments/', async (req, res, next) => {
  try {
    const comment = req.body.NewComment;
    const commentToInsert = { ...comment, date: new Date() };
    const updatePost = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: commentToInsert,
        },
      },
      { runValidators: true, new: true }
    );
    if (updatePost) {
      res.send(updatePost);
    } else {
      next(createError(404, `Post with id ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while posting update'));
  }
});

postsRouter.put('/:id/comments/:commentId', async (req, res, next) => {
  try {
    const blogPost = await postModel.findOneAndUpdate(
      {
        _id: req.params.id,
        'comments._id': req.params.commentId,
      },

      { $set: { 'comments.$': req.body } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `Blog with id:${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while updating comments'));
  }
});
postsRouter.delete('/:id/comments/:commentId', async (req, res, next) => {
  try {
    const blogPost = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.params.commentId },
        },
      },
      {
        new: true,
      }
    );
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `Blog with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while deleting comment'));
  }
});

export default postsRouter;
