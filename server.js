const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
require('dotenv').config();

const db = require('./database')
const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/healthcheck', (req, res) => {
  res.status(200).send('App is running');
})

app.post('/signin', (req, res) => signIn.handleSignIn(req, res, db, bcrypt))

// TODO: do express routes need a return? do db calls need to be returned?
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

// TODO: Maybe improve that a tiny bit
// TODO: extract repeated code to a function
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db))

app.put('/image', (req, res) => image.handleImage(req, res, db))
app.post('/imageurl', (req, res) => image.handleAPICall(req, res))

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
})

