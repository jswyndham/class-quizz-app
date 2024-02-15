import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/quizgate-logo.png';

const Landing = () => {
	return (
		<section className="w-screen h-screen flex flex-col lg:flex-row">
			<article className="flex flex-col justify-center lg:flex-row w-screen h-7/12 lg:h-2/4 items-center lg:px-24 py-12 px-3 bg-gradient-to-r from-forth to-secondary">
				<div className="flex flex-col items-center justify-between lg:justify-around lg:max-w-7xl lg:px-20 xl:mr-14">
					<div className="flex ">
						<img
							src={logo}
							alt="QuizGate logo"
							className="flex w-96"
						/>
					</div>
					<div className="flex flex-row my-6">
						<Link to="/register">
							<button className="h-14 w-32 m-4 bg-blue-500 text-white text-xl font-roboto rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
								register
							</button>
						</Link>
						<Link to="/login">
							<button className="h-14 w-32 m-4 bg-blue-500 text-white text-lg font-roboto rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
								login
							</button>
						</Link>
					</div>
				</div>
				<div className="w-11/12 md:w-8/12 lg:w-1/3 2xl:w-3/12 p-5 mt-8 lg:mt-2 bg-slate-400 rounded-xl bg-opacity-20 drop-shadow-lg shadow-lg shadow-slate-800 text-white">
					<h1 className="text-4xl font-extrabold font-robotoCondensed px-3 pt-1 pb-4">
						Elevate Your Teaching with QuizGate!
					</h1>
					<p>
						This site was built by a teacher, and designed
						specifically for teachers. This dynamic quiz platform
						blends creativity with functionality, offering an array
						of engaging quiz formats and insightful analytics. It's
						not just about assessments; it's about enriching the
						learning experience for every student. Dive into a world
						where education evolves with each click, where every
						quiz is an opportunity for growth. Join QuizGate – where
						innovative teaching meets impactful learning!
					</p>
				</div>
			</article>
		</section>
	);
};

export default Landing;
