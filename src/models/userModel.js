import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  forgotpasswordtoken: String,
  forgotpasswordtokenexpiry: Date,
  verifytoken: String,
  verifytokenexpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
