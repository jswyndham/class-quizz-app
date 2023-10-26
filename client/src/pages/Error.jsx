import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const Error = () => {
	const error = useRouteError();
	if (error.status === 404) {
		return (
			<div>
				<h2>Ohh! Page not found</h2>
				<p>We can't seem to find the page you are looking for</p>
				<Link to="/dashboard">Back Home</Link>
			</div>
		);
	}
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
