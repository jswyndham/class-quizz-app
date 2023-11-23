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
import logo from '../assets/images/slogan_main.png';
import loginBackGround from '../assets/images/quizLogIn.jpg';

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
		<section className="flex flex-row justify-center align-middle h-full w-full">
			<img
				src={loginBackGround}
				alt="teacher test creator slogan"
				className="hidden lg:flex lg:bg-contain "
			/>

			<article className="flex flex-col justify-center align-middle w-fit lg:min-w-1/2 py-16 rounded-xl">
				<div>
					<img
						src={logo}
						alt="teacher test creator slogan"
						className="mx-8 h-16 w-96"
					/>
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
								className="h-8 w-96 mt-10 mb-4 bg-white text-secondary font-bold border-solid border-2 border-secondary rounded-lg drop-shadow-lg hover:bg-secondary hover:text-white hover:font-bold hover:shadow-2xl hover:drop-shadow-xl active:shadow-sm active:bg-third"
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
