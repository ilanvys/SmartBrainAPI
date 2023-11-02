const validator = require('validator');


const validateRegistrationParams = (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) { 
    return res.status(400).json('Incorrect form submission')
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json('Invalid email format');
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json('Password must be at least 4 characters long');
  }

  return null;
}


const handleRegister = (req, res, db, bcrypt) => {
  const validationError = validateRegistrationParams(req, res);
  if (validationError) {
    return validationError;
  }

  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
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
    })
    .then(user => {
      trx.commit();
      res.json(user[0])
    })
    .catch(err => {
      trx.rollback();
      res.status(400).json('Unable to register');
    });
  })
  .catch(err => res.status(400).json('Unable To Register'));
}

module.exports = { handleRegister };
