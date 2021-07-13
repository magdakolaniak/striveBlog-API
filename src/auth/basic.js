import createError from 'http-errors';
import atob from 'atob';

import AuthorModel from '../authors/schema.js';

export const basicAuthMiddleware = async (req, res, next) => {
  // console.log(req.headers)

  // 1. Check if Authorization header is received, if it is not --> trigger an error (401)
  if (!req.headers.authorization) {
    next(
      createError(
        401,
        'Please provide credentials in the authorization header!'
      )
    );
  } else {
    // 2. Decode and extract credentials from the Authorization header (they are in base64 --> string)

    const decoded = atob(req.headers.authorization.split(' ')[1]);
    // console.log('decoded:', decoded)

    const [email, password] = decoded.split(':');

    // console.log('email:', email)
    // console.log('password:', password)
    // 3. Check the validity of credentials (find user in db by email, and compare plain pw with hashed), if they are not valid --> trigger an error (401)

    const user = await AuthorModel.checkCredentials(email, password);
    // console.log('user:', user)
    if (user) {
      // 4. Proceed to the route handler if credentials are fine
      req.user = user;
      next();
    } else {
      next(createError(401, 'Credentials are not correct!'));
    }
  }
};
