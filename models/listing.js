const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var enums = require('./enums');

const listingSchema = new Schema(
  {
    // user who made the listing
    userId:String,

    title:String,
    description:String,

    datePosted:{type: Date, default: Date.now},
    dateExpires:Date,

    formattedAddress: String,

    longitude:Number,
    latitude:Number,

    category:{type: String, enum: Object.values(enums.Categories)},

    // min number of thanks required to view listing
    minVisibility:Number,

    // array of user ids who have given thanks for this listing
    thanksRecId:[String],

    // whether the listing is active or archived
    isActive:Boolean,

    // url of the images posted
    imageURLs:[String]
  }
);

// assign state object to listingSchema
listingSchema.statics.States = enums.States;

// assign category object to listingSchema
listingSchema.statics.Categories = enums.Categories;

mongoose.model('listing',listingSchema);
