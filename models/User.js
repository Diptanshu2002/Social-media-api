const mongoose = require("mongoose");
const mongooseFuzzySearching = require( 'mongoose-fuzzy-searching')


const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc:{
      type: String,
      max : 100,
    },
    city:{
      type: String,
      max : 50 
    },
    from:{
      type: String,
      max : 50 
    },
    relationship :{
      type : Number,
      enum : [1 ,2 ,3],
    },
    refreshToken:{
      type: String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongooseFuzzySearching, { fields: ['username', 'email'] });
const UserModal = mongoose.model("User", UserSchema);
module.exports = UserModal;
