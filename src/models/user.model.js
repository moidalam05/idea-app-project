import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import config from '../config/index.js';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name.'],
			trim: true,
			maxLength: [100, 'Name cannot exceed 100 characters.'],
		},
		username: {
			type: String,
			required: [true, 'Please provide a username.'],
			trim: true,
			unique: true,
			maxLength: [50, 'Username cannot exceed 50 characters.'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email.'],
			trim: true,
			unique: true,
			maxLength: [120, 'Email cannot exceed 120 characters.'],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password.'],
			trim: true,
			maxLength: [100, 'Password cannot exceed 100 characters.'],
		},
		forgotPasswordToken: String,
		ForgotPasswordExpiry: Date,
	},
	{ timestamps: true, versionKey: false }
);

// Encrypt the password before save -- Hook
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods = {
	// compare password
	comparePassword: async function (enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	},

	// Generate JWT token
	getJWTtoken: function () {
		return JWT.sign({ _id: this._id }, config.JWT_SECRET, {
			expiresIn: config.JWT_EXPIRY,
		});
	},

	// Generate Forgot Password Token
	generateForgotPasswordToken: function () {
		const forgotToken = crypto.randomBytes(20).toString('hex');

		// Hash the token and set to forgotPasswordToken field
		this.forgotPasswordToken = crypto
			.createHash('sha256')
			.update(forgotToken)
			.digest('hex');

		// Set token expiry time
		this.ForgotPasswordExpiry = Date.now() + 10 * 60 * 1000;

		return forgotToken;
	},
};

export default mongoose.model('User', userSchema);
