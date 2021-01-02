var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  console.log(`GET IT`);
  axios
    .create({
      baseURL: "https://developer.nps.gov/api/v1/",
      headers: { "X-Api-Key": API_KEY },
    })
    .get(`/parks?limit=497`)
    //return state info
    // .then((response) => res.json(response.data))
    .then((response) => console.log(response.data))

    .catch((error) => error);
});

module.exports = router;
