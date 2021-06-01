import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import postsRouter from './blogPost/index.js';

const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cors());

server.use('/blogPosts', postsRouter);
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
