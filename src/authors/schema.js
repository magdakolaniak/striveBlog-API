import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
    avatar: { type: String },
  },
  { timestamps: true }
);
export default model('Author', AuthorSchema);
