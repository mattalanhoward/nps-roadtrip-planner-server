var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", function (req, res, next) {
  res.status(200).json({
    npsApiToken: process.env.REACT_APP_NPS_API_KEY,
    mapBoxApiToken: process.env.REACT_APP_MAPBOX_API_KEY,
  });
});

module.exports = router;
