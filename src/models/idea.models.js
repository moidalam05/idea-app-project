import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
	{
		ideaName: {
			type: String,
			required: [true, 'Please provide a name of idea.'],
			trim: true,
			maxLength: [100, 'Idea name cannot exceed 100 characters.'],
		},
		description: {
			type: String,
			required: [true, 'Please provide a description of idea.'],
			trim: true,
		},
		auther: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

export default mongoose.model('Idea', ideaSchema);
