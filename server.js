const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');

let database = {
  users: [
    {
      id: '123',
      name: 'ilan',
      email: 'ilanvys@email.com',
      password: 'password1',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'yuval',
      email: 'yuval@email.com',
      password: 'yuvalon',
      entries: 0,
      joined: new Date()
    }
  ],
  idCounter: 124
}

const app = express();

app.use(express.json());
app.use(cors());

app.get('/healthcheck', (req, res) => {
  res.status(200).send('App is running');
})

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  database.idCounter += 1;
  database.users.push({
    id: database.idCounter.toString(),
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  
  res.json(database.users[database.users.length - 1]);
})

// TODO: Maybe improve that a tiny bit
// TODO: extract repeated code to a function
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(404).json("User Not Found");
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(404).json("User Not Found");
  }
})

app.listen(3000, () => {
  console.log('App is running on port 3000');
})
