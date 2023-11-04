import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { nanoid } from 'nanoid';

const app = express();

dotenv.config();

let jobs = [
	{ id: nanoid(), company: 'apple', position: 'front-end' },
	{ id: nanoid(), company: 'google', position: 'back-end' },
];

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// MIDDLEWARE
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/', (req, res) => {
	console.log(req);
	res.json({ message: 'Data received', data: req.body });
});

// GET ALL JOBS
app.get('/api/v1/jobs', (req, res) => {
	res.status(200).json({ jobs });
});

// GET SINGLE JOB
app.get('/api/v1/jobs/:id', (req, res) => {
	const { id } = req.params;
	const job = jobs.find((job) => job.id === id);
	if (!job) {
		return res.status(404).json({ msg: `No job with id:${id} was found.` });
	}
	res.status(200).json({ job });
});

// POST NEW JOB
app.post('/api/v1/jobs', (req, res) => {
	const { company, position } = req.body;
	if (!company || !position) {
		return res
			.status(400)
			.json({ msg: 'Please provide company name and position title.' });
	}
	const id = nanoid(10);
	const job = { id, company, position };
	jobs.push(job);
	res.status(201).json({ job });
});

// EDIT JOB
app.patch('/api/v1/jobs/:id', (req, res) => {
	const { company, position } = req.body;
	if (!company || !position) {
		return res.status(400).json({
			msg: 'Please provide company name and position title.',
		});
	}
	const { id } = req.params;
	const job = jobs.find((job) => job.id === id);

	if (!job) {
		return res
			.status(404)
			.json({ msg: `No job with id ${id} could be found.` });
	}

	job.company = company;
	job.position = position;
	res.status(200).json({ msg: 'Job was modified', job });
});

// DELETE JOB
app.delete('/api/v1/jobs/:id', (req, res) => {
	const { id } = req.params;
	const job = jobs.find((job) => job.id === id);

	if (!job) {
		return res
			.status(404)
			.json({ msg: `No job with id ${id} could be found.` });
	}

	const newJobs = jobs.filter((job) => job.id !== id);
	jobs = newJobs;
	res.status(200).json({ msg: 'Job was deleted' });
});

const port = process.env.PORT || 5100;

app.listen(port, () => {
	console.log(`Server running... Listening on port ${port}`);
});
