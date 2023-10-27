import React from 'react';
import { Link } from 'react-router-dom';
import cyberpunkKyoto from '../assets/cyberpunk-kyoto.jpg';

const Login = () => {
	return (
		<section className="flex flex-col lg:flex-row justify-center align-middle m-2">
			<article className="mx-2 mb-6 ">
				<form action="" className="flex flex-col justify-center mx-4 ">
					<h1 className="m-6 text-3xl font-bold text-blue-900">
						Logn
					</h1>

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
					<div className="flex flex-row">
						<Link to="/login">
							<button className="h-8 w-24 m-4 bg-blue-400 text-white rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
								login
							</button>
						</Link>
						<p className="m-4">or</p>
						<Link to="/register" className="text-blue-400 m-4">
							Sign up
						</Link>
					</div>
				</form>
			</article>
			<article className="flex mx-6">
				<img
					src={cyberpunkKyoto}
					alt="samurai cyberpunk"
					className="w-96"
				/>
			</article>
		</section>
	);
};

export default Login;
