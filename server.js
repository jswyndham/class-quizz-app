import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// routers
import classRouter from './routes/classRouter.js';

// middleware
import errorHandlerMiddleWare from './middleWare/errorHandlerMiddleWare.js';

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTER
app.use('/api/v1/classes', classRouter);

dotenv.config();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/', (req, res) => {
	console.log(req);
	res.json({ message: 'Data received', data: req.body });
});

// 404 ERROR FOR ALL PAGES
app.use('*', (req, res) => {
	res.status(404).json({ msg: 'Page not found' });
});

// ERROR MIDDLEWARE
app.use(errorHandlerMiddleWare);

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
