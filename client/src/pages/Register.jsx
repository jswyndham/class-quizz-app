import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
	return (
		<div>
			<h1 className="m-6">Register</h1>
			<Link to="/login">Login Page</Link>
		</div>
	);
};

export default Register;
