import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<section className="flex justify-center align-middle">
			<article className="flex flex-col w-full md:w-fit py-16 border-solid border-2 border-sky-200 rounded-xl shadow-xl">
				<div className="w-full bg-blue-400 -mt-16 text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Sign Up
					</h1>
				</div>
				<div className="flex justify-center align-middle">
					<form action="" className="w-fit p-8 md:p-16">
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

						{/* BUTTON */}
						<div className="flex flex-col justify-center">
							<Link to="/login">
								<button className="h-8 w-96 mt-10 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
									login
								</button>
							</Link>

							<Link to="/register" className="text-blue-400 my-6">
								<p className="text-center">signup</p>
							</Link>
						</div>
					</form>
				</div>
			</article>
		</section>
	);
};

export default Login;
