import React from 'react';
import { Link } from 'react-router-dom';
import samuraiImage from '../assets/samurai-dark-pixel-2.jpg';

const Landing = () => {
	return (
		<main className="h-full w-full">
			<section className="flex flex-col lg:flex-row m-auto w-3/4">
				<article className="flex flex-col w-1/2">
					<div>
						<h1 className="mx-4 my-8 text-4xl font-bold text-blue-700">
							Landing Page
						</h1>
					</div>

					<div className="flex flex-row">
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
					</div>
				</article>
				<article className="flex w-1/2 mx-6">
					<img
						src={samuraiImage}
						alt="samurai pixel"
						className="w-auto"
					/>
				</article>
			</section>
		</main>
	);
};

export default Landing;
