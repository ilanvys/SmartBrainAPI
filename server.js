const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/healthcheck', (req, res) => {
  res.status(200).send('App is running');
})

// TODO: remove this route
app.get('/', (req, res) => {
  db.select('*').from('users')
  .then(data => res.json(data))
})

app.post('/signin', (req, res) => signIn.handleSignIn(req, res, db, bcrypt))

// TODO: do express routes need a return? do db calls need to be returned?
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

// TODO: Maybe improve that a tiny bit
// TODO: extract repeated code to a function
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db))

app.put('/image', (req, res) => image.handleImage(req, res, db))

app.listen(3000, () => {
  console.log('App is running on port 3000');
})
