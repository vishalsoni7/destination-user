const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },
  ],
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;