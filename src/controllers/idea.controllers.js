import Idea from '../models/idea.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';

// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private

export const createIdea = asyncHandler(async (req, res) => {
	const { ideaName, description } = req.body;
	const auther = req.user._id;

	if (!ideaName || !description) {
		throw new CustomError('Please provide idea name and description', 400);
	}
	if (ideaName.length > 100) {
		throw new CustomError('Idea name cannot exceed 100 characters', 400);
	}
	if (!auther) {
		throw new CustomError('Please provide auther', 400);
	}

	const idea = await Idea.create({ ideaName, description, auther });
	if (!idea) {
		throw new CustomError('Idea not created', 500);
	}
	res.status(201).json({
		success: true,
		message: 'Idea created successfully',
		idea,
	});
});

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public

export const getAllIdeas = asyncHandler(async (req, res) => {
	const ideas = await Idea.find().populate('auther', 'name', 'email');
	if (!ideas) {
		throw new CustomError('No ideas found', 404);
	}
	res.status(200).json({
		success: true,
		message: 'All ideas',
		ideas,
	});
});

// @desc    Get single idea
// @route   GET /api/ideas/:id
// @access  Public

export const getSingleIdea = asyncHandler(async (req, res) => {
	const { id: ideaId } = req.params;
	const idea = await Idea.findById(ideaId).populate('auther', 'name', 'email');
	if (!idea) {
		throw new CustomError('No idea found', 404);
	}
	res.status(200).json({
		success: true,
		message: 'Idea found',
		idea,
	});
});

// @desc    Update idea
// @route   PUT /api/ideas/:id
// @access  Private

export const updateIdea = asyncHandler(async (req, res) => {
	const { id: ideaId } = req.params;
	const { ideaName, description } = req.body;
	const auther = req.user._id;
	if (!ideaName || !description) {
		throw new CustomError('Please provide idea name and description', 400);
	}
	if (ideaName.length > 100) {
		throw new CustomError('Idea name cannot exceed 100 characters', 400);
	}
	if (!auther) {
		throw new CustomError('Please provide auther', 400);
	}
	const idea = await Idea.findByIdAndUpdate(
		ideaId,
		{ ideaName, description, auther },
		{ new: true }
	);

	if (!idea) {
		throw new CustomError('Idea not updated', 500);
	}
	res.status(200).json({
		success: true,
		message: 'Idea updated successfully',
		idea,
	});
});

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private

export const deleteIdea = asyncHandler(async (req, res) => {
	const { id: ideaId } = req.params;
	const idea = await Idea.findByIdAndDelete(ideaId);
	if (!idea) {
		throw new CustomError('Idea not deleted', 500);
	}
	res.status(200).json({
		success: true,
		message: 'Idea deleted successfully',
	});
});

// @desc    Get ideas by user
// @route   GET /api/ideas/user/:id
// @access  Public

export const getIdeasByUser = asyncHandler(async (req, res) => {
	const { id: userId } = req.params;
	const ideas = await Idea.find({ auther: userId });
	if (!ideas) {
		throw new CustomError('No ideas found', 404);
	}
	res.status(200).json({
		success: true,
		message: 'Ideas found',
		ideas,
	});
});
