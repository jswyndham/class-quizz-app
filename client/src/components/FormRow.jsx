import React from 'react';

const FormRow = ({ type, name, labelText, defaultValue, value, onChange }) => {
	return (
		<div className="flex flex-col m-1">
			<label
				htmlFor={name}
				className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
			>
				{labelText || name}
			</label>
			<input
				type={type}
				id={name}
				name={name}
				className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
				defaultValue={defaultValue}
				value={value}
				onChange={onChange}
				required
			/>
		</div>
	);
};

export default FormRow;
