import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleWare = (err, req, res, next) => {
	console.log(err);
	const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	const msg = 'Something went wrong on the server. Try again later.';
	res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleWare;
