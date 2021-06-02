import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      value: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
      },
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        elementId: String,
        comment: String,
        author: String,
        rate: Number,
        date: '',
      },
    ],
  },
  { timestamps: true }
);

export default model('Post', PostSchema);
