const UserModel = {
  username: {
    type: 'string',
    required: true,
    minLength: 3
  },
  email: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true,
    minLength: 6
  }
};

function validateUser(data) {
  const errors = [];

  if (!data.username || data.username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  if (!data.email) {
    errors.push('Email is required');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
}

module.exports = {
  UserModel,
  validateUser
};