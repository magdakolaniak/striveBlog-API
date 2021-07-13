import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    avatar: { type: String },
  },
  { timestamps: true }
);

AuthorSchema.pre('save', async function (next) {
  const newAuthor = this;

  const plainPw = newAuthor.password;

  if (newAuthor.isModified('password')) {
    newAuthor.password = await bcrypt.hash(plainPw, 10);
  }
  next();
});
// AuthorSchema.methods.toJSON = function () {
//   // toJSON is a method called every time express does a res.send

//   const user = this;

//   const userObject = user.toObject();

//   delete userObject.password;

//   delete userObject.__v;

//   return userObject;
// };
AuthorSchema.statics.checkCredentials = async function (email, plainPw) {
  // 1. find user in db by email

  const user = await this.findOne({ email });
  console.log(user);

  if (user) {
    // 2. compare plainPw with hashed pw
    const hashedPw = user.password;
    console.log(hashedPw, plainPw);

    const isMatch = await bcrypt.compare(plainPw, hashedPw);
    console.log(isMatch);

    // 3. return a meaningful response

    if (isMatch) return user;
    else return null;
  } else {
    return null;
  }
};

// AuthorSchema.statics.updateWithPassword = async function (id, data) {
//   const newAuthor = this.findById(id);
//   if (newAuthor) {
//     if (newAuthor.password !== data.password) {
//       const plainPw = data.password;
//       newPassword = await bcrypt.hash(plainPw, 10);
//       data.password = newPassword;
//     }
//   }
// };
export default model('Author', AuthorSchema);
