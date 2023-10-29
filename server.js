const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');


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

app.post('/signin', (req, res) => {
  return db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    if (isValid) {
      return db.select('*').from('users')
      .where('email', '=', req.body.email)
      .then(user => {
        res.json(user[0])
      })
      .catch(err =>  res.status(400).json('Unable to get user'))
    } else {
      res.status(400).json('Wrong credentials')
    }
    })
    .catch(err =>  res.status(400).json('Wrong credentials'))
})

// TODO: do express routes need a return? do db calls need to be returned?
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  var hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({ hash, email })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*')
      .insert({
        email: loginEmail[0].email,
        name: name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  }).catch(err => res.status(400).json('Unable To Register'));
})

// TODO: Maybe improve that a tiny bit
// TODO: extract repeated code to a function
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
  .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('User Not Found')
    }
  })
  .catch(err => res.status(404).json('Error getting user'));
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
})

app.listen(3000, () => {
  console.log('App is running on port 3000');
})
