const log = (store) => (next) => (action) => {
	console.log(action);
	next(action);
};

export default log;
