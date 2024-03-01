import { Form, Link, useNavigate } from 'react-router-dom';
import { FormRow, FormRowSelect } from '../components';
import { toast } from 'react-toastify';
import { USER_STATUS } from '../../../server/utils/constants.js';
import { useState } from 'react';
import { registerUser } from '../features/authenticate/authAPI';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/images/quizgate-logo.png';

const Register = () => {
	const [freeRegistrationForm, setFreeRegistrationForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		location: '',
		userStatus: '',
	});

	const isLoading = useSelector((state) => state.auth.loading);

	// Filter out admin as a status option for new users
	const statusOptions = Object.values(USER_STATUS).filter(
		(status) => status !== USER_STATUS.ADMIN
	);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		setFreeRegistrationForm({
			...freeRegistrationForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Submit has been pressed');

		// Check if passwords match
		if (
			freeRegistrationForm.password !==
			freeRegistrationForm.confirmPassword
		) {
			toast.error('Passwords do not match');
			return;
		}
		// Exclude confirmPassword from the data sent to the backend
		const { confirmPassword, ...userData } = freeRegistrationForm;

		// Run the redux slice
		try {
			await dispatch(registerUser(userData)).unwrap();
			navigate('/login');
			toast.success('Registration successful');
		} catch (error) {
			toast.error(error || 'Login failed');
		}
	};

	return (
		<section className="h-screen flex justify-center align-middle sm:p-3 md:p-24 bg-gradient-to-br from-forth to-secondary">
			<article className="flex flex-col w-fit bg-white py-16 border-solid border-2 border-sky-200 rounded-xl shadow-xl">
				<div className="w-full bg-blue-400 -mt-16 text-center rounded-t-lg">
					<h1 className="m-6 text-4xl font-bold text-white font-robotoCondensed">
						Sign Up
					</h1>
				</div>

				<div className="h-fit bg-white flex justify-center align-middle">
					<Form onSubmit={handleSubmit} className="w-fit p-8 md:p-16">
						{/* FIRST NAME */}
						<FormRow
							type="text"
							name="firstName"
							labelText="first name"
							value={freeRegistrationForm.firstName}
							onChange={handleChange}
						/>

						{/* LAST NAME */}
						<FormRow
							type="text"
							name="lastName"
							labelText="last name"
							value={freeRegistrationForm.lastName}
							onChange={handleChange}
						/>

						{/* EMAIL */}
						<FormRow
							type="email"
							name="email"
							labelText="email"
							value={freeRegistrationForm.email}
							onChange={handleChange}
						/>

						{/* password */}
						<FormRow
							type="password"
							name="password"
							labelText="password"
							value={freeRegistrationForm.password}
							onChange={handleChange}
						/>

						{/* Confirm password */}
						<FormRow
							type="password"
							name="confirmPassword"
							labelText="confirm password"
							value={freeRegistrationForm.confirmPassword}
							onChange={handleChange}
						/>

						{/* LOCATION */}
						<FormRow
							type="text"
							name="location"
							labelText="country location"
							value={freeRegistrationForm.location}
							onChange={handleChange}
						/>

						{/* ROLE */}
						<div className="mr-4 my-2">
							<FormRowSelect
								labelText="User Role"
								name="userStatus"
								value={freeRegistrationForm.userStatus}
								onChange={handleChange}
								list={statusOptions.map((status) => ({
									label: status.label,
									value: status.value,
								}))}
							/>
						</div>

						{/* BUTTON */}
						<div className="flex flex-col justify-center">
							<button
								type="submit"
								disabled={isLoading}
								className="h-12 w-72 mx-6 md:mx-14 mt-10 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
							>
								{isLoading ? 'submitting...' : 'submit'}
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
				<div className="flex justify-center m-auto p-4 ">
					<img src={logo} alt="QuizGate logo" className="flex w-72" />
				</div>
			</article>
		</section>
	);
};

export default Register;
