const express = require('express');
const authRouter = express.Router();
const transporter = require('../helpers/mailerConfig');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pools = require('../helpers/pwdb');
const path=require('path');


// Forgot password route
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const client = await pools.connect();
    const user = await client.query('SELECT * FROM account WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      client.release();
      return res.status(404).send('Email not found.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000); 

    await client.query('UPDATE account SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3', [token, expiry, email]);
    client.release();

    const mailOptions = {
      from: 'cooltechnerd1@gmail.com',
      to: email,
      subject: 'Password Reset Link',
      text: `You are receiving this email because you (or someone else) have requested the reset of your password. Please click on the following link, or paste it into your browser to complete the process: http://127.0.0.1:3001/auth/reset/${token}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send('Recovery email sent, please check your inbox.');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to serve the password reset page
authRouter.get('/reset/:token', async (req, res) => {
  const { token } = req.params;
  try {
      const client = await pools.connect();
      // Check if the token exists and is not expired
      const result = await client.query('SELECT * FROM account WHERE reset_password_token = $1 AND reset_password_expires > NOW()', [token]);
      client.release();

      if (result.rows.length === 0) {
          return res.status(404).send('Password reset token is invalid or has expired.');
      }

      // If using static HTML
      res.sendFile(path.join(__dirname, '../../reset-password.html'));

  } catch (err) {
      console.error('Database query error', err);
      res.status(500).send('Server error during token validation.');
  }
});

// Password reset route
authRouter.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log("URL accessed:", req.originalUrl);
console.log("Token received:", req.params.token);
  try {
    const client = await pools.connect();
    const user = await client.query('SELECT * FROM account WHERE reset_password_token = $1 AND reset_password_expires > NOW()', [token]);

    if (user.rows.length === 0) {
      client.release();
      return res.status(400).send('Token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query('UPDATE account SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE email = $2', [hashedPassword, user.rows[0].email]);
    client.release();

    res.send('Password has been successfully reset.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



module.exports = authRouter;
