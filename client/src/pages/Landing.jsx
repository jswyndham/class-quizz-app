import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
	return (
		<main className="h-full w-full">
			<section className="flex flex-col m-auto w-1/2">
				<article>
					<h1 className="mx-4 my-8 text-4xl font-bold text-blue-700">
						Landing Page
					</h1>
				</article>

				<article>
					<Link to="/register">
						<button className="h-8 w-24 m-4 bg-blue-400 text-white rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
							register
						</button>
					</Link>
					<Link to="/login">
						<button className="h-8 w-24 m-4 bg-blue-400 text-white rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
							login
						</button>
					</Link>
				</article>
			</section>
		</main>
	);
};

export default Landing;
