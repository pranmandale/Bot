import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },   
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// generate token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '15m'});
  return token;
}

// access token
userSchema.statics.findByToken = function(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.findById(decoded._id);
  } catch (error) {
    return null;
  }
};

// refresh token
userSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign({_id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
  return refreshToken;
}

const User = mongoose.model("User", userSchema);
export default User;
