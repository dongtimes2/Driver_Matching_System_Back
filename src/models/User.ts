import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: String,
  name: String,
  userType: String,
});

const User = mongoose.model("User", UserSchema);

export default User;
