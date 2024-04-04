import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authenticate/authAPI';
import { FormRow } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/quizgate-logo.png';
import { fetchCurrentUser } from '../features/user/userAPI';

const Login = () => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLoading = useSelector((state) => state.auth.loading);
	const error = useSelector((state) => state.auth.error);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await dispatch(loginUser(formData)).unwrap();
			await dispatch(fetchCurrentUser()).unwrap();
			navigate('/dashboard');
			toast.success('Login successful');
		} catch (error) {
			toast.error(error || 'Login failed');
		}
	};

	return (
		<section className="h-screen md:p-24 bg-gradient-to-br from-forth to-secondary">
			<article className="flex flex-col items-center w-full md:px-6 md:pt-40 rounded-xl">
				<div className="h-auto max-w-xl my-12 px-6">
					<img src={logo} alt="QuizGate logo" />
				</div>
				<div className="w-fit bg-white mt-4 rounded-xl shadow-xl shadow-slate-700">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col py-12"
					>
						<div className="flex flex-col ml-3 pl-2">
							{/* EMAIL */}
							<FormRow
								type="email"
								name="email"
								labelText="email"
								value={formData.email}
								onChange={handleChange}
							/>

							{/* PASSWORD */}
							<FormRow
								type="password"
								name="password"
								labelText="password"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						{/* BUTTON */}
						<div className="flex flex-col justify-center w-fit">
							<button
								type="submit"
								disabled={isLoading}
								className="h-12 w-64 mx-12 mt-10 mb-4 bg-blue-700 text-lg text-white font-bold border-solid border-2 border-slate-400 rounded-lg drop-shadow-lg hover:bg-forth hover:text-white hover:border-forth hover:font-bold hover:shadow-xl hover:shadow-slate-300 hover:drop-shadow-xl active:shadow-sm active:bg-white active:text-forth"
							>
								{isLoading ? 'Logging in...' : 'login'}
							</button>
							<div className="flex justify-center">
								<p className="text-lg font-bold text-red-600">
									{error}
								</p>
							</div>
							<div className="flex flex-row justify-center mt-6">
								<p className="mx-2 text-xl">
									Not yet a member?
								</p>
								<Link to="/register" className="text-blue-400">
									<p className="text-center text-blue-600 text-xl">
										signup
									</p>
								</Link>
							</div>
						</div>
					</form>
				</div>
			</article>
		</section>
	);
};

export default Login;
