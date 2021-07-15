import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import postsRouter from './blogPost/index.js';
import authorsRouter from './authors/index.js';
import passport from 'passport';
import oauth from './auth/oauth.js';
import cookieParser from 'cookie-parser';

const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cookieParser());

server.use(passport.initialize());
server.use(cors());

server.use('/blogPosts', postsRouter);
server.use('/authors', authorsRouter);
console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(
    server.listen(port, () => {
      console.log('Running on port', port);
    })
  )
  .catch((err) => console.log(err));
