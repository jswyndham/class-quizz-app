const FormRowSelect = ({
	name,
	labelText,
	list,
	defaultValue,
	value,
	onChange,
}) => {
	return (
		<div className="flex flex-col py-1">
			<label
				htmlFor={name}
				className="block mb-2 ml-4 text-lg font-medium text-gray-900 dark:text-white"
			>
				{labelText || name}
			</label>
			<select
				name={name}
				id={name}
				className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				defaultValue={defaultValue}
				value={value}
				onChange={onChange}
			>
				<option value="">-- select --</option>
				{list.map((item) => (
					<option key={item.value} value={item.value}>
						{item.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default FormRowSelect;
