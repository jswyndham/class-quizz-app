import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import classRouter from './routes/classRouter.js';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// MIDDLEWARE
app.use(express.json());

// ROUTER
app.use('/api/v1/classes', classRouter);

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
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).json({ msg: 'Something went wrong on the server' });
});

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
