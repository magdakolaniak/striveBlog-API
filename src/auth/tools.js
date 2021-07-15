import jwt from 'jsonwebtoken';
import AuthorModel from '../authors/schema.js';

export const JWTAuthenticate = async (author) => {
  const accessToken = await generateJWT({ _id: author._id });
  const refreshToken = await generateRefreshJWT({ _id: author._id });
  author.refreshToken = refreshToken;
  await author.save();
  return { accessToken, refreshToken };
};

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verifyToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);

      resolve(decodedToken);
    })
  );

const generateRefreshJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1 day' },
      (err, token) => {
        if (err) reject(err);

        resolve(token);
      }
    )
  );
const verifyRefreshToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
      if (err) reject(err);

      resolve(decodedToken);
    })
  );
// export const refreshTokens = async (actualRefreshToken) => {
//   // 1. Is the actual refresh token not valid or expired?

//   const content = await verifyRefreshToken(actualRefreshToken);

//   // 2. If the token is valid we are going to find the user in db

//   const user = await AuthorModel.findById(content._id);

//   if (!user) throw new Error('User not found');

//   // 3. Once we have the user we can compare actualRefreshToken with the refresh token saved in db

//   if (user.refreshToken === actualRefreshToken) {
//     // 4. If everything is fine we can generate the new tokens
//     const newAccessToken = await generateJWT({ _id: user._id });

//     const newRefreshToken = await generateRefreshJWT({ _id: user._id });

//     // refresh token is saved in db

//     user.refreshToken = newRefreshToken;

//     await user.save();

//     return { newAccessToken, newRefreshToken };
//   } else {
//     throw new Error('Refresh Token not valid!');
//   }
// };
