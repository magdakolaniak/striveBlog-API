import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import AuthorModel from '../authors/schema.js';
import { JWTAuthenticate } from './tools.js';

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3001/authors/googleRedirect',
    },
    async (accessToken, refreshToken, profile, passportNext) => {
      // this function will be executed when we got a response back from Google
      try {
        console.log(profile);
        // when we receive the profile we are going to check if it is an existant user in our db, if it is not we are going to create a new record
        const user = await AuthorModel.findOne({ googleId: profile.id });

        if (user) {
          // if the user is already in the db, I'm creating for him a pair of tokens
          const tokens = await JWTAuthenticate(user);
          console.log(tokens);
          passportNext(null, { user, tokens });
        } else {
          // if the user is not in the db, I'm creating a new record for him, then I'm creating a pair of tokens
          const newAuthor = {
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value,
            role: 'User',
            googleId: profile.id,
          };

          const createdAuthor = new AuthorModel(newAuthor);

          const savedAuthor = await createdAuthor.save();

          const tokens = await JWTAuthenticate(savedAuthor);
          passportNext(null, { user: savedAuthor, tokens });
        }
      } catch (error) {
        passportNext(error);
      }
    }
  )
);

passport.serializeUser(function (user, passportNext) {
  // this is for req.user

  passportNext(null, user);
});

// passport.use("facebook")

export default {};
