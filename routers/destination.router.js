const express = require('express');
const destinationRouter = express.Router();
const Destination = require('../model/destination');

const { createDestination,
  readTravelDestination,
  readAllTravelDestinations,
  readTravelDestinationsByLocation,
  readTravelDestinationsByRating,
  updateTravelDestination,
  deleteTravelDestination,
  filterDestinationsByRating,
  addReview,
  getReviews } = require('../service/destination.service');

destinationRouter.post('/', async (req, res) => {
  try {
    const checkBody = !req.body.name ||
      !req.body.city ||
      !req.body.country ||
      !req.body.description;

    if (checkBody) {
      res.status(400).json({ error: 'all required fields must be provided!' });
    } else {
      const existingDestination = await Destination.findOne({ name: req.body.name });

      if (existingDestination) {
        res.status(400).json({ error: 'destination already registered!' });
      } else {
        const newDestination = await createDestination(req.body);
        res.status(201).json({ message: 'New destination added.', destination: newDestination });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'error while creating a new destination!' });
  }
});

destinationRouter.get('/rating', async (req, res) => {
  try {
    const destinations = await readTravelDestinationsByRating();

    if (destinations) {
      res.status(200).json({ message: 'destinations based on ratings.', destinations })
    } else {
      res.status(400).json({ error: 'destinations not found based on ratings!' })
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to fetch destination based on ratings!' })
  }
})

destinationRouter.get('/', async (req, res, next) => {
  try {
    const destinations = await readAllTravelDestinations()
    res.status(200).json({ message: 'all destinations.', destinations })
  } catch (error) {
    res.status(500).json({ error: 'unable to fetch destinations!' })
    next(error)
  }
})

destinationRouter.get('/:name', async (req, res) => {
  try {
    const name = req.params.name
    const findDestination = await readTravelDestination(name)

    if (findDestination) {
      res.status(200).json({ message: 'destination found based on name.', destination: findDestination })
    } else {
      res.status(400).json({ error: 'destination not found based on name!' })
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to fetch destination based on name!' })
  }
})

destinationRouter.get('/location/:location', async (req, res) => {
  try {
    const location = req.params.location
    const destination = await readTravelDestinationsByLocation(location);

    if (destination) {
      res.status(200).json({ message: 'destination found based on location.', destination })
    } else {
      res.status(400).json({ error: 'destination not found based location!' })
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to fetch destination based on location!' })
  }
})

destinationRouter.post('/:destinationId', async (req, res) => {
  try {
    const id = req.params.destinationId;
    const data = req.body

    if (id) {
      if (data) {
        const updatedDestination = await updateTravelDestination(id, data);
        res.status(200).json({ message: 'destination updated.', updatedDestination })
      } else {
        res.status(400).json({ error: 'please provide updated data!' })
      }
    } else {
      res.status(400).json({ error: 'destination not found for update!' })
    }

  } catch (error) {
    res.status(500).json({ error: 'unable to update destination!' })
  }
})

destinationRouter.delete('/:destinationId', async (req, res) => {
  try {
    const id = req.params.destinationId;
    const deletedDestination = await deleteTravelDestination(id);

    if (deletedDestination) {
      res.status(200).json({ message: 'destination deleted.', deletedDestination })
    } else {
  res.status(400).json({ error: 'destination not found for delete!' })    
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to delete destination!' })
  }
})

destinationRouter.get('/filter/:minRating', async (req, res) => {
  try {
    const ratings = req.params.minRating;
    const destinations = await filterDestinationsByRating(ratings)

    if (destinations) {
      res.status(200).json({ message: 'destination found based on ratings.', destinations })
    } else {
      res.status(400).json({ error: 'destinations not found based on ratings!' })
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to filter destinations based on ratings!' })
  }
})

destinationRouter.post('/:destinationId/reviews', async (req, res) => {
  try {
    const id = req.params.destinationId;
    const review = req.body;

    if (review) {      
      const destinationWithReview = await addReview(id, review)

      if (destinationWithReview) {
         res.status(200).json({ message: 'review added to the destination.', destinationWithReview })     
      } else {
         res.status(400).json({ error: 'destination not found!' })
      }
    } else {
      res.status(400).json({ error: 'please provide review data!' })
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to add review to the destination!' })
  }
})

destinationRouter.get('/:destinationId/reviews', async (req, res) => {
  try {
    const id = req.params.destinationId;
    const topThreeReviews = await getReviews(id)

    if (topThreeReviews) {
      res.status(200).json({ message: 'top reviews of the destination.', topThreeReviews })
    } else {
      res.status(400).json({ error: 'no reviews found!' })
    }
  } catch (error) {
    res.status(500).json({ error: 'unable to fetch top reviews!' })
  }
})

module.exports = destinationRouter