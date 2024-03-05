import { Form } from 'react-router-dom';
import { FormRow, FormRowSelect } from '..';
import { useNavigation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ClassForm = ({
	onSubmit,
	nameRow,
	classKey,
	subjectRow,
	schoolRow,
	nameValue,
	statusValue,
	subjectValue,
	schoolValue,
	classNameDefault,
	classStatusDefault,
	subjectDefault,
	schoolDefault,
}) => {
	const navigation = useNavigation();
	const isLoading = useSelector((state) => state.class.loading);
	return (
		<div className="w-full h-full max-w-lg mx-3 my-6 rounded-lg bg-white flex justify-center border border-slate-400 shadow-xl shadow-slate-500">
			<Form
				method="post"
				key={classKey}
				onSubmit={onSubmit}
				className="w-11/12 flex flex-col justify-center px-4 py-10 drop-shadow-lg"
			>
				<div className="w-full ml-2 my-2">
					<FormRow
						type="text"
						name="className"
						labelText="Class Title"
						placeholder="class title"
						onChange={nameRow}
						value={nameValue}
						defaultValue={classNameDefault}
					/>
				</div>

				<div className="w-full flex flex-col">
					<div className="w-full ml-2 my-2">
						<FormRow
							type="text"
							name="subject"
							labelText="Subject"
							placeholder="subject"
							onChange={subjectRow}
							value={subjectValue}
							defaultValue={subjectDefault}
						/>
					</div>

					<div className="w-full ml-2 my-2">
						<FormRow
							type="text"
							name="school"
							labelText="School Name"
							placeholder="school name"
							onChange={schoolRow}
							value={schoolValue}
							defaultValue={schoolDefault}
						/>
					</div>
					<button
						type="submit"
						className="h-10 w-11/12 2xl:w-60 mt-10  bg-blue-400 text-white text-lg font-bold rounded-lg ml-2 drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
					>
						{isLoading ? 'submitting...' : 'submit'}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default ClassForm;
