import mongoose from "mongoose";

interface IUser {
  _id: string;
  name: string;
  type: string;
  refreshToken: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id: { type: String, default: "", required: true },
  name: { type: String, default: "", required: true },
  type: { type: String, default: "" },
  refreshToken: { type: String, default: "" },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
