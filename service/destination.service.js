const mongoose = require('mongoose');

const Destination = require('../model/destination')

const fs = require('fs');
const jsonData = fs.readFileSync('destination.json', 'utf8');
const destinationArray = JSON.parse(jsonData);

const seedDestinationData = async () => {
  try {
    for (const destinationData of destinationArray) {
      const newDestination = new Destination({
        name: destinationData.name,
        city: destinationData.city,
        country: destinationData.country,
        description: destinationData.description,
        rating: destinationData.rating,
        reviews: destinationData.reviews
      });
      await newDestination.save();
      console.log(`Destination ${newDestination.name} seeded.`);
    }
    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error while seeding database.', error);
  } finally {
    mongoose.disconnect();
  }
};

const createDestination = async (destination) => {
  try {
    const checkFields = destination.name &&
      destination.city &&
      destination.country &&
      destination.description

    if (checkFields) {

      const destinationToBeAdded = new Destination(destination);
      const newDestination = await destinationToBeAdded.save()

      console.log(`new destination ${newDestination.name} created.`);
      return newDestination;
    } else {
      console.error('please fill required fileds');
    }
  } catch (error) {
    console.error('error while adding new destination:', error);
  }
};

const readTravelDestination = async (name) => {
  try {
    const findDestination = await Destination.findOne({ name })

    if (findDestination) {

      console.log(findDestination)
      return findDestination;

    } else {
      console.error('destination not found')
    }
  } catch (error) {
    console.error('error while fetching destination by name,', error)
  }
}

const readAllTravelDestinations = async () => {
  try {
    const allDestinations = await Destination.find();

    if (allDestinations.length > 0) {
      console.log(allDestinations);
      return allDestinations;

    } else {
      console.log('No destinations saved.');
    }
  } catch (error) {
    console.error('Error while fetching destinations:', error);
  }
};

const readTravelDestinationsByLocation = async (givenLocation) => {
  try {
    const findDestination = await Destination.find({
      $or: [
        { city: givenLocation },
        { country: givenLocation }
      ]
    })

    if (findDestination.length > 0) {
      console.log(findDestination);
      return findDestination;

    } else {
      console.error('destination not found')
    }
  } catch (error) {
    console.error('error while getching destination,', error)
  }
}

const readTravelDestinationsByRating = async () => {
  try {

    const destinations = await Destination.find().sort({ rating: -1 });
    console.log(destinations);
    return destinations

  } catch (error) {
    console.error('error while fetching destinations based on rating,', error)
  }
}

const updateTravelDestination = async (destinationId, updatedData) => {
  try {

    if (updatedData) {

      const updatedDestination = await Destination
        .findByIdAndUpdate(destinationId, updatedData, { new: true })

      console.log(updatedDestination);
      return updatedDestination
    } else {
      console.log('please provide data')
    }
  } catch {
    console.error('error while updating destination,', error)
  }
}

const deleteTravelDestination = async (destinationId) => {
  try {
    const findDestination = await Destination.findByIdAndDelete(destinationId)

    if (findDestination) {
      console.log(`your destination ${findDestination.name} deleted`)
      return findDestination
    } else {
      console.error('destination not found')
    }
  } catch (error) {
    console.error('error while deleting destination,', error)
  }
}

const filterDestinationsByRating = async (givenRating) => {
  try {
    const findDestinations = await Destination.find({ rating: { $gte: givenRating } })

    if (findDestinations.length > 0) {
      console.log(findDestinations);
      return findDestinations
    } else {
      console.log('no destinations found')
    }
  } catch (error) {
    console.error('error while filtering destination based on minimum rating,', error)
  }
}

const addReview = async (destinationId, reviewData) => {
  try {
    const findDestination = await Destination.findById(destinationId);

    if (findDestination) {

      const review = {
        userId: reviewData.userId,
        text: reviewData.text,
        rating: reviewData.rating
      }
      findDestination.reviews.push(review)

      await findDestination.save()

      const updatedDestination = await Destination.findById(destinationId)
        .populate('reviews.userId', 'userName')

      console.log(updatedDestination)
      return updatedDestination
    } else {
      console.log('destination not found')
    }
  } catch (error) {
    console.error('error while adding review,', error)
  }
}

const getReviews = async (destinationId) => {
  try {
    const destination = await Destination.findById(destinationId).populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'userName profilePicture'
      }
    })

    if (destination) {
      const allReviews = destination.reviews
        .slice(0, 3)
        .map((review) => ({
          reviewText: review.text,
          user: review.userId.userName
        }));
      console.log(allReviews)

      return allReviews
    } else {
      console.log('destination not found')
    }
  } catch (error) {
    console.error('unable to find reviews', error)
  }
}

module.exports = {
  seedDestinationData,
  createDestination,
  readTravelDestination,
  readAllTravelDestinations,
  readTravelDestinationsByLocation,
  readTravelDestinationsByRating,
  updateTravelDestination,
  deleteTravelDestination,
  filterDestinationsByRating,
  addReview,
  getReviews
};
