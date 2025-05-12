import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  personal_info: {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
