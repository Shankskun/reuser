const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var enums = require('./enums');

const reviewSchema = new Schema(
  {
    // user who left this review
    leftByEmail:String,
    // user who this review is for
    givenToEmail:String,


    title:String,
    contents:String,
    starRating:Number
  }
);

mongoose.model('review',reviewSchema);