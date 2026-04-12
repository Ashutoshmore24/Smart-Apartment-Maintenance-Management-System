/* Everything Ready */
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://smart-apartment-maintenance-management-w8ds.onrender.com";

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

module.exports = passport;