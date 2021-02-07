var express = require("express");
var router = express.Router();
const axios = require("axios");
const ParksModel = require("../models/Parks.model");
const UserModel = require("../models/User.model");
const RoadTripsModel = require("../models/RoadTrips.model");

const API_KEY = process.env.NPS_API_KEY;
// console.log(`Backend API`, API_KEY);

/* POST get users favorite parks. */
router.post("/usersFavorites", (req, res) => {
  // console.log(`Get favorite parks triggered`);
  const { userId } = req.body;
  // console.log(`USER id`, userId);
  UserModel.findOne({ _id: userId })
    .then((user) => {
      // console.log(`Find user`, user.favoriteParks);
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(`Error getting user's favorites`, error);
      res.status(500).json(error);
    });
});

/* POST add favorite park. */
router.post("/favorites", (req, res) => {
  const { park, userId } = req.body;
  //   console.log(`Favorite Params `, park);
  //   console.log(`Favorite UserId `, userId);

  //Add user to Park Model favorites.
  ParksModel.findOne({ park: park }, {}, { upsert: true })
    .then((park) => {
      if (park) {
        park.usersFavorited.includes(userId)
          ? park.usersFavorited.splice(park.usersFavorited.indexOf(userId), 1)
          : park.usersFavorited.push(userId);
        park.save();
      } else {
        ParksModel.create({
          park,
          usersFavorited: userId,
        });
      }
    })
    .catch((error) => {
      console.log(`Error updating park's user's favorites`, error);
      res.status(500).json(error);
    });

  //Add favorite to User model.
  UserModel.findOne({ _id: userId })
    .then((user) => {
      const parkCodesArr = user.favoriteParks.map((park) => park.parkCode);
      //   console.log(parkCodesArr);
      parkCodesArr.includes(park.parkCode)
        ? user.favoriteParks.splice(parkCodesArr.indexOf(park.parkCode), 1)
        : user.favoriteParks.push(park);

      user.save();
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(`Error user's favorites`, error);
      res.status(500).json(error);
    });
});

//Add Park to NEW Road Trip

router.post("/addToNewRoadTrip", (req, res) => {
  const { parkId, userId, tripName } = req.body;

  RoadTripsModel.create({
    name: tripName,
    rating: null,
    completed: false,
    comments: "",
    user: userId,
    parks: [parkId],
  })
    .then((roadtrip) =>
      UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { userRoadTrips: roadtrip._id } },
        { safe: true, upsert: true, new: true }
      ).then(
        UserModel.findById(userId).then((user) => {
          res.status(200).json(user);
        })
      )
    )
    .catch((error) => {
      console.log(`Error adding to NEW Roadtrip`, error);
      res.status(500).json(error);
    });
});

//Add Park to EXISTING Road Trip
router.post("/addToExistingRoadTrip", (req, res) => {
  console.log(`existing`);
  const { parkId, userId, tripName } = req.body;

  RoadTripsModel.findOneAndUpdate(
    { _id: tripName },
    { $push: { parks: tripName } },
    { safe: true, upsert: true, new: true }
  )
    .then(
      UserModel.findById(userId).then((user) => {
        res.status(200).json(user);
      })
    )
    .catch((error) => {
      console.log(`Error adding to EXISTING Roadtrip`, error);
      res.status(500).json(error);
    });
});

//Delete Road Trip
router.post("/deleteRoadTrip", (req, res) => {
  const { tripName, userId } = req.body;
  console.log(`UserId`, userId);
  console.log(`tripName`, tripName);

  RoadTripsModel.findOneAndDelete({ _id: tripName })
    .then(
      UserModel.findById(userId).then((user) => {
        res.status(200).json(user);
      })
    )
    .catch((error) => {
      console.log(`Error adding to EXISTING Roadtrip`, error);
      res.status(500).json(error);
    });
});

module.exports = router;
