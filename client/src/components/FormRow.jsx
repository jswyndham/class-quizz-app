import React from 'react';

const FormRow = ({ type, name, labelText, defaultValue }) => {
	return (
		<div className="flex flex-col m-1">
			<label htmlFor={name} className="text-lg text-bold mb-1 px-2">
				{labelText || name}
			</label>
			<input
				type={type}
				id={name}
				name={name}
				className="h-8 w-96 border-2 outline-gray-700 drop-shadow-md px-2 py-4"
				defaultValue={defaultValue}
				required
			/>
		</div>
	);
};

export default FormRow;
