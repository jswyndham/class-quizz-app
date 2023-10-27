import React from 'react';
import { Link } from 'react-router-dom';
import samuraiImage from '../assets/samurai-dark-pixel-2.jpg';

const Register = () => {
	return (
		<section className="flex flex-col lg:flex-row justify-center align-middle m-2">
			<article className="mx-2 mb-6 ">
				<form action="" className="flex flex-col justify-center mx-4 ">
					<h1 className="m-6 text-3xl font-bold text-blue-900">
						Register
					</h1>

					{/* FIRST NAME */}
					<div className="flex flex-col justify-start align-middle m-1">
						<label
							htmlFor="first-name"
							className="text-lg text-bold mb-1 px-2"
						>
							first name
						</label>
						<input
							type="text"
							id="first-name"
							name="first-name"
							className="h-8 w-96 border-2 outline-gray-700 drop-shadow-md px-2 py-4"
						/>
					</div>

					{/* LAST NAME */}
					<div className="flex flex-col justify-start align-middle m-1">
						<label
							htmlFor="last-name"
							className="text-lg text-bold mb-1 px-2"
						>
							last name
						</label>
						<input
							type="text"
							id="last-name"
							name="last-name"
							className="h-8 w-96 border-2 outline-gray-700 drop-shadow-md px-2 py-4"
						/>
					</div>

					{/* EMAIL */}
					<div className="flex flex-col justify-start align-middle m-1">
						<label
							htmlFor="email"
							className="text-lg text-bold mb-1 px-2"
						>
							email
						</label>
						<input
							type="text"
							id="email"
							name="email"
							className="h-8 w-96 border-2 outline-gray-700 drop-shadow-md px-2 py-4"
						/>
					</div>

					{/* PASSWORD */}
					<div className="flex flex-col justify-start align-middle m-1">
						<label
							htmlFor="password"
							className="text-lg text-bold mb-1 px-2"
						>
							password
						</label>
						<input
							type="text"
							id="password"
							name="password"
							className="h-8 w-96 border-2 outline-gray-700 drop-shadow-md px-2 py-4"
						/>
					</div>

					{/* CONFIRM PASSWORD */}
					<div className="flex flex-col justify-start align-middle m-1">
						<label
							htmlFor="confirm-password"
							className="text-lg text-bold mb-1 px-2"
						>
							confirm password
						</label>
						<input
							type="text"
							id="confirm-password"
							name="confirm-password"
							className="h-8 w-96 border-2 outline-gray-700 drop-shadow-md px-2 py-4"
						/>
					</div>

					{/* BUTTON */}
					<Link to="/login">
						<button className="h-8 w-24 m-4 bg-blue-400 text-white rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
							login
						</button>
					</Link>
				</form>
			</article>
			<article className="flex mx-6">
				<img
					src={samuraiImage}
					alt="samurai pixel"
					className="w-auto"
				/>
			</article>
		</section>
	);
};

export default Register;
