import { StatusCodes } from 'http-status-codes';
import sanitizeHtml from 'sanitize-html';
import Quiz from '../models/QuizModel.js';
import ClassGroup from '../models/ClassModel.js';
import { getCache, setCache, clearCache } from '../utils/cache/cache.js';

// Function to dynamically generate a unique cache key based on user ID and query parameters.
// This will ensure that users only access the data relevant to their requests.
const generateCacheKey = (userId) => {
	return `quizzes_${userId}`;
};

// Configuration for HTML sanitization
const sanitizeConfig = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img']),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
		img: ['src', 'alt'],
	},

	// Custom transformations for specific tags that are allowed to be shown in the tinyMCE editor. This has been done to tighten security and sanitation regarding what is accepted by the rich text editor.
	transformTags: {
		iframe: (tagName, attribs) => {
			// Regex to validate YouTube URLs in iframe
			// Two expressions are used to match YouTube URL in iframe src
			const iframeRegex =
				/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/embed\/[\w-]+(\?.*)?$/;
			if (attribs.src && iframeRegex.test(attribs.src)) {
				return {
					tagName: 'iframe',
					attribs: {
						src: attribs.src,
						width: attribs.width || '560',
						height: attribs.height || '315',
						frameborder: attribs.frameborder || '0',
						allowfullscreen: attribs.allowfullscreen || '',
					},
				};
			}
			return {
				tagName: 'p',
				text: '(Video removed for security reasons)',
			};
		},
		img: (tagName, attribs) => {
			// Regular expression to match jpg and png image URLs
			const dataUrlRegex = /^data:image\/(png|jpeg|jpg);base64,/;
			const imageUrlRegex = /\.(jpg|jpeg|png)$/i;

			// Check if the src attribute of the img tag matches allowed formats
			if (
				attribs.src &&
				(dataUrlRegex.test(attribs.src) ||
					imageUrlRegex.test(attribs.src))
			) {
				// Return the img tag with its attributes if it matches the criteria
				return {
					tagName: 'img',
					attribs: {
						src: attribs.src,
						alt: attribs.alt || '',
					},
				};
			}
			return {
				tagName: 'p',
				text: '(Image removed for security reasons)',
			};
		},
	},
};

// Controller to get all quizzes by user
export const getAllQuizzes = async (req, res) => {
	const userId = req.user.userId;
	const cacheKey = `quiz_${userId}`;

	try {
		const cachedData = getCache(cacheKey);

		if (cachedData) {
			console.log(`Cache hit for allQuizzes key: ${cacheKey}`);

			// Deserialize each item back into an object
			const allQuizzes = cachedData.map((item) => JSON.parse(item));

			return res.status(StatusCodes.OK).json({ allQuizzes });
		} else {
			console.log(`Cache miss for allQuizzes key: ${cacheKey}`);

			let allQuizzes = await Quiz.find({ createdBy: req.user.userId })
				.populate('class')
				.lean({ virtuals: true })
				.exec();

			// Serialize each quiz for caching (this is for the benefit of getting the schema virtuals in the cache, which is easier to retreive)
			const serializedQuizzes = allQuizzes.map((quiz) =>
				JSON.stringify(quiz)
			);

			// Set data in cache for future requests
			setCache(cacheKey, serializedQuizzes, 3600); // Caches for 1 hour

			res.status(StatusCodes.OK).json({ allQuizzes });
		}
	} catch (error) {
		console.error('Error finding all quizzes:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to get a single quiz
export const getQuiz = async (req, res) => {
	const quizId = req.params.id;
	const userId = req.user.userId;
	const cacheKey = `quiz_${userId}_${quizId}`;

	try {
		const cachedQuiz = getCache(cacheKey);
		if (cachedQuiz) {
			console.log(`Cache hit for key: ${cacheKey}`);

			// Deserialize the quiz object
			const quiz = JSON.parse(cachedQuiz);

			return res.status(StatusCodes.OK).json({ quiz: quiz });
		}

		console.log(`Cache miss for key: ${cacheKey}`);
		const quiz = await Quiz.findById(quizId)
			.populate('class')
			.lean({ virtuals: true })
			.exec();

		if (!quiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz not found' });
		}

		// Serialize the quiz for faster caching
		const serializedQuiz = JSON.stringify(quiz);
		setCache(cacheKey, serializedQuiz, 10800); // Caching for 3 hours

		res.status(StatusCodes.OK).json({ quiz });
	} catch (error) {
		console.error('Error finding quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to create a new quiz
export const createQuiz = async (req, res) => {
	try {
		const userId = req.user.userId;

		// Extract classId from the request body
		let { class: classIds, ...quizData } = req.body;

		// Set the creator of the quiz
		const createdBy = req.user.userId;

		// Sanitize and prepare questions data
		if (quizData.questions && quizData.questions.length > 0) {
			quizData.questions = quizData.questions.map((question) => {
				const correctOption = question.options.find(
					(option) => option.isCorrect
				);
				return {
					...question,
					questionText: sanitizeHtml(
						question.questionText,
						sanitizeConfig
					),
					correctAnswer: correctOption
						? correctOption.optionText
						: null,
				};
			});
		}

		// Ensure classIds is an array and contains valid MongoDB ObjectId
		classIds = Array.isArray(classIds) ? classIds : [classIds];

		// Create new quiz with classIds
		const newQuiz = await Quiz.create({
			...quizData,
			createdBy,
			class: classIds,
		});

		// Asynchronously update the corresponding class object with the new quiz
		await Promise.all(
			classIds.map(async (classId) => {
				await ClassGroup.findByIdAndUpdate(
					classId,
					{ $push: { quizzes: newQuiz._id } },
					{ new: true }
				);

				// Clear the cache for this specific class
				const specificClassCacheKey = `class_${userId}_${classId}`;
				clearCache(specificClassCacheKey);
			})
		);

		// Clear cache related to the user's classes and quizzes

		clearCache(`class_${userId}`, `quiz_${userId}`);

		res.status(StatusCodes.CREATED).json({ quiz: newQuiz });
	} catch (error) {
		console.error('Error creating quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to update an existing quiz
export const updateQuiz = async (req, res) => {
	try {
		const userId = req.user.userId;

		// Get the id of the quiz being updated
		const id = req.params.id;
		let { class: classIds, ...quizData } = req.body;

		// Handle cases where classIds might not be an array
		classIds = Array.isArray(classIds) ? classIds : [classIds];

		// Sanitize and update questions data
		if (quizData.questions && quizData.questions.length > 0) {
			quizData.questions = quizData.questions.map((question) => {
				const correctOption = question.options.find(
					(option) => option.isCorrect
				);
				return {
					...question,
					questionText: sanitizeHtml(
						question.questionText,
						sanitizeConfig
					),
					correctAnswer: correctOption
						? correctOption.optionText
						: null,
				};
			});
		}

		// Find the quiz before upadating and check that it exists
		const existingQuiz = await Quiz.findById(id);

		if (!existingQuiz) {
			return res.status(StatusCodes.NOT_FOUND).json({
				msg: 'Quiz not found',
			});
		}

		// Update the quiz
		const updatedQuiz = await Quiz.findByIdAndUpdate(
			id,
			{ ...quizData, class: classIds },
			{ new: true, timestamps: true }
		)
			.populate({ path: 'class' })
			.exec();

		if (!updatedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Manual computation of virtual fields. This is performed here due to an error caused by Mongoose related to the virtuals field in the schema.
		updatedQuiz.totalPoints = updatedQuiz.questions.reduce(
			(sum, question) => sum + question.points,
			0
		);
		updatedQuiz.questionCount = updatedQuiz.questions.length;

		// Loop through the class array and clear cache for each class that contained the updated quiz
		updatedQuiz.class.forEach((classItem) => {
			const classCacheKey = `class_${userId}_${classItem._id.toString()}`;
			console.log('Class cache key: ', classCacheKey);

			clearCache(classCacheKey);
		});

		// Clear the cache for the updated quiz
		const quizCacheKey = `quiz_${userId}_${id}`;
		// Clear the all quizzes cache
		const quizzesCacheKey = `quizzes_${userId}`;
		// Clear cache for all classes
		const allClassesCacheKey = `class_${userId}`;

		clearCache(quizCacheKey);
		clearCache(quizzesCacheKey);
		clearCache(allClassesCacheKey);

		res.status(StatusCodes.OK).json({
			msg: 'Quiz updated successfully',
			quiz: updatedQuiz,
		});
	} catch (error) {
		console.error('Error updating quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			msg: error.message,
		});
	}
};

// Controller to copy a quiz to a class
export const copyQuizToClass = async (req, res) => {
	try {
		const { _id, classId } = req.body;

		// Validate if the class exists
		const classGroup = await ClassGroup.findById(classId);
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

		// Define and fetch the original quiz
		const originalQuiz = await Quiz.findById(_id);
		if (!originalQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Deep clone the quiz and prepare for new quiz creation. The 'toObject()' method creates a new object, which is filled with the copy, 'JSON.parse(JSON.stringify(...))'
		const newQuizData = JSON.parse(JSON.stringify(originalQuiz.toObject()));
		delete newQuizData._id; // Remove the original ID
		newQuizData.class = [classId]; // Set the new class ID

		// Create and save the new quiz
		const newQuiz = new Quiz(newQuizData);
		await newQuiz.save();

		// Update the class with the new quiz in the 'quizzes' array in classGroup schema.
		await ClassGroup.findByIdAndUpdate(classId, {
			$addToSet: { quizzes: newQuiz._id },
		});

		// Clear the cache for both classes and quizzes when saved
		const quizCacheKey = `quiz_${req.user.userId}_${req.params.id}`;
		const allClassesCacheKey = `class_${req.user.userId}`;
		clearCache(allClassesCacheKey, quizCacheKey);

		res.status(StatusCodes.OK).json({
			msg: 'Quiz copied to class successfully',
			newQuizId: newQuiz._id,
		});
	} catch (error) {
		console.error('Error copying quiz to class:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to delete a quiz
export const deleteQuiz = async (req, res) => {
	try {
		const userId = req.user.userId;
		const quizId = req.params.id;

		// Delete the quiz and include classes that contained that quiz schema class array
		const quiz = await Quiz.findByIdAndDelete(quizId);
		const classesContainingQuiz = quiz ? quiz.class : [];

		// Update all ClassGroup documents that contain that quiz
		await ClassGroup.updateMany(
			{ quizzes: quizId },
			{ $pull: { quizzes: quizId } }
		);

		// Loop through the class array in the quiz schema and clear cache for class array.
		//Rather than clearing the whole class cache, which would remove all quizzes from ClassLayout page, this will only remove the selected quiz from cache.
		classesContainingQuiz.forEach((classId) => {
			const classCacheKey = `class_${userId}_${classId}`;
			clearCache(classCacheKey);
		});

		// Clear quizzes cache
		const quizzesCacheKey = `quizzes_${userId}`;
		clearCache(quizzesCacheKey);

		res.status(StatusCodes.OK).json({
			msg: 'Quiz deleted',
			quizId: quizId,
		});
	} catch (error) {
		console.error('Error deleting quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to add a question to a quiz
export const addQuestionToQuiz = async (req, res) => {
	try {
		const quizId = req.params.id;
		const questionData = { ...req.body };

		// Sanitize question and option texts
		if (questionData.questionText) {
			questionData.questionText = sanitizeHtml(
				questionData.questionText,
				sanitizeConfig
			);
		}

		// Sanitize options and set correct answer
		if (questionData.options) {
			questionData.options = questionData.options.map(
				(option, index) => ({
					...option,
					optionText: sanitizeHtml(option.optionText, sanitizeConfig),
					isCorrect: index === questionData.correctAnswer,
				})
			);
		}

		// Update quiz with the new question
		const updatedQuiz = await Quiz.findByIdAndUpdate(
			quizId,
			{ $push: { questions: questionData } },
			{ new: true, runValidators: true }
		);

		// Validate if updatedQuiz exists
		if (!updatedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// If the cache already exists, update cache with new question objects
		const quizCacheKey = `quiz_${quizId}`;
		const cachedQuiz = getCache(quizCacheKey);
		if (cachedQuiz) {
			cachedQuiz.questions.push(questionData);
			setCache(quizCacheKey, cachedQuiz, 3600);
		} else {
			// Otherwise, clear the cache
			clearCache(quizCacheKey);
		}

		res.status(StatusCodes.OK).json({
			msg: 'Question added',
			quiz: updatedQuiz,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			msg: error.message,
		});
	}
};
