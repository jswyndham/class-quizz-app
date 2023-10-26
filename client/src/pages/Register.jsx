import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
	return (
		<section>
			<article>
				<form action="">
					<h1 className="m-6">Register</h1>
					<div className="flex flex-col justify-start align-middle m-2">
						<label htmlFor="name">name</label>
						<input
							type="text"
							id="name"
							name="name"
							className="h-8 w-80 outline-1 outline-gray-500 drop-shadow-md"
						/>
					</div>
					<Link to="/login">
						<button className="h-8 w-24 m-4 bg-blue-400 text-white rounded-lg drop-shadow-md hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
							login
						</button>
					</Link>
				</form>
			</article>
		</section>
	);
};

export default Register;
