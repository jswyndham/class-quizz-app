import React from 'react';
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import { FormRow, FormRowSelect } from '../components';
import customFetch from '../utils/customFetch.js';
import { toast } from 'react-toastify';
import { USER_STATUS } from '../../../server/utils/constants.js';

// access all fields using fromData() method and turn entries into an object
export const action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	try {
		await customFetch.post('/auth/register', data);
		toast.success('Registration successful');
		return redirect('/login');
	} catch (error) {
		console.log(error);
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const Register = () => {
	// filter out admin as status option
	const statusOptions = Object.values(USER_STATUS).filter(
		(status) => status !== USER_STATUS.ADMIN
	);

	const navigation = useNavigation();

	const isSubmitting = navigation.state === 'submitting';

	return (
		<section className="flex justify-center align-middle p-12 md:p-24">
			<article className="flex flex-col w-full md:w-fit py-16 border-solid border-2 border-sky-200 rounded-xl shadow-xl">
				<div className="w-full bg-blue-400 -mt-16 text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Sign Up
					</h1>
				</div>

				<form className="max-w-md mx-auto">
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="email"
							name="floating_email"
							id="floating_email"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							htmlFor="floating_email"
							className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Email address
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="password"
							name="floating_password"
							id="floating_password"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							htmlFor="floating_password"
							className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Password
						</label>
					</div>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="password"
							name="repeat_password"
							id="floating_repeat_password"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							htmlFor="floating_repeat_password"
							className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Confirm password
						</label>
					</div>
					<div className="grid md:grid-cols-2 md:gap-6">
						<div className="relative z-0 w-full mb-5 group">
							<input
								type="text"
								name="floating_first_name"
								id="floating_first_name"
								className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								required
							/>
							<label
								htmlFor="floating_first_name"
								className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								First name
							</label>
						</div>
						<div className="relative z-0 w-full mb-5 group">
							<input
								type="text"
								name="floating_last_name"
								id="floating_last_name"
								className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								required
							/>
							<label
								htmlFor="floating_last_name"
								className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								Last name
							</label>
						</div>
					</div>
					<div className="grid md:grid-cols-2 md:gap-6">
						<div className="relative z-0 w-full mb-5 group">
							<input
								type="tel"
								pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
								name="floating_phone"
								id="floating_phone"
								className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								required
							/>
							<label
								htmlFor="floating_phone"
								className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								Phone number (123-456-7890)
							</label>
						</div>
						<div className="relative z-0 w-full mb-5 group">
							<input
								type="text"
								name="floating_company"
								id="floating_company"
								className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								required
							/>
							<label
								htmlFor="floating_company"
								className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								Company (Ex. Google)
							</label>
						</div>
						<label htmlFor="underline_select" className="sr-only">
							Underline select
						</label>
						<select
							id="underline_select"
							className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
						>
							<option selected>Choose a country</option>
							<option value="US">United States</option>
							<option value="CA">Canada</option>
							<option value="FR">France</option>
							<option value="DE">Germany</option>
						</select>
					</div>
					<button
						type="submit"
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Submit
					</button>
				</form>

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
						<div className="mx-4 my-2">
							<FormRowSelect
								labelText="User Role"
								name="userStatus"
								defaultValue={USER_STATUS.STUDENT}
								list={statusOptions}
							/>
						</div>

						{/* BUTTON */}
						<div className="flex flex-col justify-center">
							<button
								type="submit"
								disabled={isSubmitting}
								className="h-8 w-96 mt-10 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
							>
								{isSubmitting ? 'submitting...' : 'submit'}
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
