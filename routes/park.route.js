var express = require("express");
var router = express.Router();
const axios = require("axios");
const ParksModel = require("../models/Parks.model");
const UserModel = require("../models/User.model");

const API_KEY = process.env.NPS_API_KEY;
// console.log(`Backend API`, API_KEY);

/* POST get users favorite parks. */
router.post("/usersFavorites", (req, res) => {
  console.log(`Get favorite parks triggered`);
  const { userId } = req.body;
  console.log(`USER id`, userId);
  UserModel.findOne({ _id: userId })
    .then((user) => {
      console.log(`Find user`, user.favoriteParks);
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(`Error getting user's favorites`, error);
      res.status(500).json(error);
    });
});

/* POST add favorite park. */
router.post("/favorites", (req, res) => {
  const { parkCode, userId } = req.body;
  console.log(`Favorite Params `, parkCode);
  console.log(`Favorite UserId `, userId);

  //Add user to Park Model favorites.
  ParksModel.findOne({ parkCode: parkCode }, {}, { upsert: true })
    .then((park) => {
      if (park) {
        park.usersFavorited.includes(userId)
          ? park.usersFavorited.splice(park.usersFavorited.indexOf(userId), 1)
          : park.usersFavorited.push(userId);
        park.save();
      } else {
        ParksModel.create({
          parkCode,
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
      user.favoriteParks.includes(parkCode)
        ? user.favoriteParks.splice(user.favoriteParks.indexOf(parkCode), 1)
        : user.favoriteParks.push(parkCode);

      user.save();
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(`Error user's favorites`, error);
      res.status(500).json(error);
    });
});

module.exports = router;
