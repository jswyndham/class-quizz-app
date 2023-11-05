import ClassGroup from '../models/ClassModel.js';

// GET ALL CLASSES
export const getAllClasses = async (req, res) => {
	const classGroups = await ClassGroup.find();
	res.status(200).json({ classGroups });
};

// CREATE CLASS
export const createClass = async (req, res) => {
	const classGroup = await ClassGroup.create(req.body);
	return res.status(201).json({ classGroup });
};

// GET SINGLE CLASS
export const getClass = async (req, res) => {
	const { id } = req.params;
	const classGroup = await ClassGroup.findById(id);
	if (!classGroup) {
		return res
			.status(404)
			.json({ msg: `No class with id:${id} was found.` });
	}
	res.status(200).json({ classGroup });
};

// UPDATE CLASS
export const updateClass = async (req, res) => {
	const { id } = req.params;
	const updatedClass = await ClassGroup.findByIdAndUpdate(id, req.body, {
		new: true,
	});
	if (!updatedClass) {
		return res
			.status(404)
			.json({ msg: `No job with id ${id} could be found.` });
	}

	res.status(200).json({ msg: 'Job was modified', class: updatedClass });
};

// DELETE Class
export const deleteClass = async (req, res) => {
	const { id } = req.params;
	const removedClass = await ClassGroup.findByIdAndDelete(id);
	if (!removedClass) {
		return res
			.status(404)
			.json({ msg: `No job with id ${id} could be found.` });
	}

	res.status(200).json({ msg: 'Class was deleted' });
};
