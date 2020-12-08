// models/Parks.js

const { Schema, model } = require("mongoose");

const parksSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    stateCode: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
      required: [true, "Username is required."],
    },

    favoriteParks: [{ type: Schema.Types.ObjectId, ref: "Parks" }],
    userRoadTrips: [{ type: Schema.Types.ObjectId, ref: "RoadTrips" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Parks", userSchema);
