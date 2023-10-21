const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB;

const initializeDatabase = () => {
  if (!mongoURI) {
    console.error('Environment variable is not defined.');
  } else {
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log('Connected to MongoDB');
    }).catch(error => {
      console.error('Error connecting to MongoDB:', error);
    });
  }
}

module.exports = initializeDatabase