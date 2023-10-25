import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const Error = () => {
	const error = useRouteError();
	console.log(error);
	return (
		<main className="h-screen">
			<div>
				<h1 className="mt-96 mb-6 text-red-700">Error</h1>
				<Link to="/">Go back home</Link>
			</div>
		</main>
	);
};

export default Error;
