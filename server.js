import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

// routers
import classRouter from './routes/classRouter.js';

// middleware
import errorHandlerMiddleware from './middleWare/errorHandlerMiddleware.js';

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTER
app.use('/api/v1/classes', classRouter);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/', (req, res) => {
	res.send('Hello World!');
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
