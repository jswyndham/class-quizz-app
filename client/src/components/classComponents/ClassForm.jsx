import { Form } from 'react-router-dom';
import { FormRow, FormRowSelect } from '..';
import { useNavigation } from 'react-router-dom';

const ClassForm = ({
	onSubmit,
	nameRow,
	classStatusRow,
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
	const isSubmitting = navigation.state === 'submitting';
	return (
		<div className="flex justify-center align-middle">
			<Form
				method="post"
				onSubmit={onSubmit}
				className="flex flex-col p-24 drop-shadow-lg 2xl:ml-20"
			>
				<div className="w-fit mx-4 my-2">
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

				<div className="flex flex-col 2xl:flex-row mx-4">
					<div className="mx-4 my-2">
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

					<div className="mx-4 my-2">
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
						className="h-8 w-full 2xl:w-60 mt-8 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
					>
						{isSubmitting ? 'submitting...' : 'submit'}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default ClassForm;
