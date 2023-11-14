import React from 'react';
import {
	Form,
	Link,
	redirect,
	useActionData,
	useNavigation,
} from 'react-router-dom';
import { FormRow } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

// REACT ROUTER ACTION
export const action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const errors = { msg: '' };
	if (data.password.length < 4) {
		errors.msg = 'password must be more that 4 characters';
		return errors;
	}
	try {
		await customFetch.post('/auth/login', data);
		toast.success('Login successful');
		return redirect('/dashboard');
	} catch (error) {
		//toast.error(error?.response?.data?.msg);
		errors.msg = error?.response?.data?.msg;
		return errors;
	}
};

const Login = () => {
	const errors = useActionData();
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
				<div className="flex justify-center align-middle">
					<Form method="post" className="w-fit p-8 md:p-16">
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

						{/* BUTTON */}
						<div className="flex flex-col justify-center">
							<button
								type="submit"
								disabled={isSubmitting}
								className="h-8 w-96 mt-10 mb-4 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
							>
								{isSubmitting ? 'submitting...' : 'login'}
							</button>
							{errors?.msg && (
								<p style={{ color: 'red' }}>{errors.msg}</p>
							)}
							<div className="flex flex-row justify-center mt-6">
								<p className="mx-2">Not yet a member?</p>
								<Link to="/register" className="text-blue-400">
									<p className="text-center">signup</p>
								</Link>
							</div>
						</div>
					</Form>
				</div>
			</article>
		</section>
	);
};

export default Login;
