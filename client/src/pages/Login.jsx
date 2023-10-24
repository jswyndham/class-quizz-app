import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<div>
			<h1 className="m-6">Login</h1>
			<Link to="/register">Register Page</Link>
		</div>
	);
};

export default Login;
