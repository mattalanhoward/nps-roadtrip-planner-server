var express = require("express");
var router = express.Router();
const axios = require("axios");
const ParksModel = require("../models/Parks.model");

const API_KEY = process.env.NPS_API_KEY;
// console.log(`Backend API`, API_KEY);

/* POST add favorite park. */
router.post("/favorites", (req, res) => {
  const { parkCode, userId } = req.body;
  //   console.log(`Favorite Params `, parkCode);
  //   console.log(`Favorite UserId `, userId);

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
    .catch((error) => error);
});

module.exports = router;
