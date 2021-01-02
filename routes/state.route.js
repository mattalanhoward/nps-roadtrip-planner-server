var express = require("express");
var router = express.Router();
const axios = require("axios");

const API_KEY = process.env.NPS_API_KEY;
console.log(`Backend API`, API_KEY);

/* GET all state parks from api. */
router.get("/:stateAbbr", (req, res) => {
  console.log(" GET NPS API requested ");
  console.log(`GET NPS API Params `, req.params.stateAbbr);
  //call api
  axios
    .create({
      baseURL: "https://developer.nps.gov/api/v1/",
      headers: { "X-Api-Key": API_KEY },
    })
    //filter by state
    .get(`/parks?statecode=${req.params.stateAbbr}`)
    //return state info
    .then((response) => res.json(response.data))
    .catch((error) => error);
});

module.exports = router;
