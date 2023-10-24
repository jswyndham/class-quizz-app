import React from 'react';
import { Link, useRouteError } from 'react-router';

const Error = () => {
	const error = useRouteError();
	console.log(error);
	return (
		<main className="h-screen">
			<div>
				<h1 className="mt-96">Error</h1>
				<Link to="/">Go back home</Link>
			</div>
		</main>
	);
};

export default Error;
