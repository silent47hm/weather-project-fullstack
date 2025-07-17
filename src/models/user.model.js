// models/user.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10); //salt for passowrd encryption and Hashing to make table attacks useless add random hasing to same passwords so same passwords with different hashing.
});

userSchema.methods.comparePassword = function (plainPassword) {
  //Verifies login by comparing password
  return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
