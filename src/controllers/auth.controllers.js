import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

export const cookieOptions = {
	expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};

export const register = asyncHandler(async (req, res) => {
	const { name, username, email, password, confirmPassword } = req.body;

	if (!name || !username || !email || !password) {
		throw new CustomError('Please fill in all fields', 400);
	}
	if (password.length < 8) {
		throw new CustomError('Password must be at least 8 characters', 400);
	}
	if (password !== confirmPassword) {
		throw new CustomError('Passwords do not match', 400);
	}
	if (!email.includes('@')) {
		throw new CustomError('Please provide a valid email', 400);
	}

	// check if user already exists
	const existingUser = await User.findOne({ email });

	if (existingUser) {
		throw new CustomError('User already exists', 400);
	}

	// create the user
	const user = await User.create({
		name,
		username,
		email,
		password,
	});

	const token = user.getJWTtoken();
	user.password = undefined;
	res.cookie('token', token, cookieOptions);

	res.status(201).json({
		success: true,
		message: 'User registered successfully',
		token,
		user,
	});
});

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public

export const login = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	if (!username && !email) {
		throw new CustomError('Please provide a username or email', 400);
	}
	if (!password) {
		throw new CustomError('Please provide a password', 400);
	}
	if (password.length < 8) {
		throw new CustomError('Password should be at least 8 characters long', 400);
	}
	if (!email.includes('@')) {
		throw new CustomError('Please provide a valid email', 400);
	}
	const user = await User.findOne({ $or: [{ email }, { username }] }).select(
		'+password'
	);
	if (!user) {
		throw new CustomError('Invalid credentials', 401);
	}
	// check if username or email is matches
	if (user.username !== username && user.email !== email) {
		throw new CustomError('Invalid username or email', 401);
	}
	// check if password is matches
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		throw new CustomError('Password do not matched', 401);
	}

	// generate token and send the response
	const token = user.getJWTtoken();
	user.password = undefined;
	res.cookie('token', token, cookieOptions);
	res.status(200).json({
		success: true,
		message: 'User logged in successfully',
		user,
		token,
	});
});

// @desc    Logout a user
// @route   GET /api/auth/logout
// @access  Private

export const logout = asyncHandler(async (req, res) => {
	// clear the cookie
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private

export const getProfile = asyncHandler(async (req, res) => {
	const { user } = req;
	if (!user) {
		throw new CustomError('User not found', 404);
	}
	res.status(200).json({ success: true, user });
});
