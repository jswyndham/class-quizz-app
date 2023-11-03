import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const PORT = 5100;

app.listen(PORT, () => {
	console.log(`Server running... Listening on port ${PORT}`);
});
