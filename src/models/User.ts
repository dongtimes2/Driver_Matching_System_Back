import mongoose from "mongoose";

interface IUser {
  _id: string;
  name: string;
  type: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id: String,
  name: { type: String, default: "", require: true },
  type: { type: String, default: "", require: true },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
