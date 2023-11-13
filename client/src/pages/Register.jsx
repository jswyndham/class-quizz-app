import React from 'react';
import { Form, Link } from 'react-router-dom';
import { FormRow } from '../components';
import customFetch from '../utils/customFetch';

// access all fields using fromData() method and turn entries into an object
export const action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	try {
		await customFetch.post('/auth/register', data);

		return null;
	} catch (error) {
		console.log(error);
		return error;
	}
};

const Register = () => {
	return (
		<section className="flex justify-center align-middle p-12 md:p-24">
			<article className="flex flex-col w-full md:w-fit py-16 border-solid border-2 border-sky-200 rounded-xl shadow-xl">
				<div className="w-full bg-blue-400 -mt-16 text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Sign Up
					</h1>
				</div>
				<div className="flex justify-center align-middle">
					<Form method="post" className="w-fit p-8 md:p-16">
						{/* FIRST NAME */}
						<FormRow
							type="text"
							name="firstName"
							labelText="first name"
							defaultValue="James"
						/>
						{/* LAST NAME */}
						<FormRow
							type="text"
							name="lastName"
							labelText="last name"
							defaultValue="Saunders-Wyndham"
						/>
						{/* EMAIL */}
						<FormRow
							type="email"
							name="email"
							labelText="email"
							defaultValue="jsw@email.com"
						/>
						{/* PASSWORD */}
						<FormRow
							type="password"
							name="password"
							labelText="password"
							defaultValue="password1234"
						/>

						{/* LOCATION */}
						<FormRow
							type="text"
							name="location"
							labelText="country location"
							defaultValue="Japan"
						/>

						{/* ROLE */}
						<FormRow
							type="text"
							name="role"
							labelText="role"
							defaultValue="teacher"
						/>

						{/* BUTTON */}
						<div className="flex flex-col justify-center">
							<button
								type="submit"
								className="h-8 w-96 mt-10 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
							>
								signup
							</button>

							<div className="flex flex-row justify-center mt-6">
								<p className="mx-2">Already a member?</p>
								<Link to="/login" className="text-blue-400">
									<p className="text-center">login</p>
								</Link>
							</div>
						</div>
					</Form>
				</div>
			</article>
		</section>
	);
};

export default Register;
