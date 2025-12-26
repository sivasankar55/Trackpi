import express from 'express';
import passport from 'passport';

const router = express.Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const { token, phoneNumber } = req.user;
    // Redirect to /home if phoneNumber exists, else to /phone-number
    const redirectPath = phoneNumber ? 'start-course' : 'phone-number';
    res.redirect(`http://localhost:5173/${redirectPath}?token=${token}`);
  }
);

export default router; 