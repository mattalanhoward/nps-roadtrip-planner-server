var express = require("express");
var router = express.Router();
const axios = require("axios");
const ParksModel = require("../models/Parks.model");
const UserModel = require("../models/User.model");

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

//Add Park to Road Trip
router.post("/addToRoadTrip", (req, res) => {
  const { parkId, userId, tripName } = req.body;
  // console.log(parkId, userId, tripName);

  UserModel.findOne({ _id: userId })
    .then((user) => {
      const findTrip = user.userRoadTrips.filter(
        (trip) => trip.tripName === tripName
      );
      console.log(`FOUND TRIP`, findTrip[0]);

      if (findTrip.length > 0) {
        findTrip[0].parkId.push(parkId);
        user.save();
        console.log(user.userRoadTrips);
        res.status(200).json(user);
      } else {
        user.userRoadTrips.push({
          tripName: tripName,
          parkId: [parkId],
        });
        user.save();
        res.status(200).json(user);
      }
    })
    .catch((error) => {
      console.log(`Error adding to Roadtrip`, error);
      res.status(500).json(error);
    });
});

module.exports = router;
