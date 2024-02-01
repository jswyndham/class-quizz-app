import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// routers
import quizRouter from './routes/quizRouter.js';
import classRouter from './routes/classRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import cloudinaryRouter from './routes/cloudinaryRouter.js';
import quizAttemptRouter from './routes/quizAttemptRouter.js';
import membershipRouter from './routes/membershipRouter.js';

// middleware
import errorHandlerMiddleware from './middleWare/errorHandlerMiddleware.js';
import { authenticateUser } from './middleWare/authMiddleware.js';

// caching in node
import NodeCache from 'node-cache';

// EXPRESS
const app = express();

// CACHE
const cache = new NodeCache();

// MIDDLEWARE
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

// ROUTER
app.use('/api/v1/quiz', authenticateUser, quizRouter);
app.use('/api/v1/class', authenticateUser, classRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/upload', cloudinaryRouter);
app.use('/api/v1/quizAttempt', authenticateUser, quizAttemptRouter);
app.use('/api/v1/membership', authenticateUser, membershipRouter);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/api/v1/test', (req, res) => {
	res.json({ msg: 'test route' });
});

// 404 ERROR FOR ALL PAGES
app.use('*', (req, res) => {
	res.status(404).json({ msg: 'Page not found' });
});

// ERROR MIDDLEWARE
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(port, () => {
		console.log(`Server running on port ${port}... Connected to MongoDB`);
	});
} catch (error) {
	console.log(error);
	process.exit(1);
}
