import express from 'express';
import createError from 'http-errors';

import AuthorsModel from './schema.js';
import bcrypt from 'bcrypt';
import { basicAuthMiddleware } from '../auth/basic.js';

const authorsRouter = express.Router();

authorsRouter.get('/', basicAuthMiddleware, async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find();
    res.send(authors);
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error occured while getting authors'));
  }
});

authorsRouter.get('/:id', async (req, res, next) => {
  try {
    const authorId = req.params.id;
    const author = await AuthorsModel.findById(authorId);
    if (author) {
      res.send(author);
    } else {
      next(createError(404, `An author with id: ${authorId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while getting authors'));
  }
});
authorsRouter.post('/', async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      next(createError(400, error));
    } else {
      next(createError(500, 'An error while saving new author'));
    }
  }
});

// authorsRouter.put('/:id', async (req, res, next) => {
//   try {
//     const data = req.body;
//     console.log(data);
//     const author = await AuthorsModel.findByIdAndUpdate(
//       req.params.id,
//       req.body
//     );

//     if (author) {
//       res.send(author);
//     } else {
//       next(createError(404, `An author with id: ${authorId} not found`));
//     }
//   } catch (error) {
//     console.log(error);
//     next(createError(500, 'An error occured while updating an author'));
//   }
// });

authorsRouter.put('/:id/password', async (req, res, next) => {
  try {
    let data = req.body;

    const plainPw = req.body.password;
    const newPassword = await bcrypt.hash(plainPw, 10);
    data.password = newPassword;
    const author = await AuthorsModel.findByIdAndUpdate(req.params.id, data);
    res.send(author);
  } catch (error) {
    console.log(error.message);
  }
});

authorsRouter.delete('/:id', async (req, res, next) => {
  try {
    const authorId = req.params.id;
    const author = await AuthorsModel.findByIdAndDelete(authorId);
    if (author) {
      res.status(204).send('Sucesfully deleted!');
    } else {
      next(createError(404, `An author with id: ${authorId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error occured while deleting an author'));
  }
});

export default authorsRouter;