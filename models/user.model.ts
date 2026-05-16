import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  emailVerified: Boolean,
  name: String,
  image: String,
  createdAt: Date,
  updatedAt: Date,
  role: String,
  banned: Boolean
}, { collection: 'user' });

export default mongoose.models.User || mongoose.model('User', userSchema);