import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';

export const JWTAuthenticate = async (author) => {
  const accessToken = await generateJWT({ _id: author._id });
  return accessToken;
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
