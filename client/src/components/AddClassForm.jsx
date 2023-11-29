import { useState } from 'react';
import { Form, useNavigation, useNavigate } from 'react-router-dom';
import { CLASS_STATUS } from '../../../utils/constants';
import { FormRow, FormRowSelect } from './';
import { useDispatch } from 'react-redux';
import { createClass } from '../features/classGroup/classAPI';
// import { toast } from 'react-toastify';

const AddClassForm = () => {
	// HOOKS
	const [className, setClassName] = useState('');
	const [subject, setSubject] = useState('');
	const [classStatus, setClassStatus] = useState('');
	const [school, setSchool] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// ON CHANGE
	const onNameChanged = (e) => setClassName(e.target.value);
	const onSubjectChanged = (e) => setSubject(e.target.value);
	const onSchoolChanged = (e) => setSchool(e.target.value);
	const onClassStatusChanged = (e) => setClassStatus(e.target.value);

	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';

	// SUBMIT
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (className && subject && classStatus && school) {
			try {
				await dispatch(
					createClass({ className, subject, classStatus, school })
				).unwrap(); // Waits for the promise to resolve
				console.log(createClass);
				navigate('/dashboard');
			} catch (error) {
				console.error('Failed to create class:', error);
				console.log('Failed to create class:', error);
			}
		}
	};

	return (
		<div className="flex justify-center align-middle">
			<Form
				method="post"
				onSubmit={handleSubmit}
				className="flex flex-col p-24 drop-shadow-lg 2xl:ml-20"
			>
				<div className="flex flex-col 2xl:flex-row mx-4 my-1">
					<div className="w-fit mx-4 my-2">
						<FormRow
							type="text"
							name="className"
							labelText="Class Title"
							placeholder="class title"
							onChange={onNameChanged}
						/>
					</div>
					<div className="mx-4 my-2">
						<FormRowSelect
							labelText="Class Status"
							name="classStatus"
							defaultValue={CLASS_STATUS.CURRENT}
							list={Object.values(CLASS_STATUS)}
							onChange={onClassStatusChanged}
						/>
					</div>
				</div>
				<div className="flex flex-col 2xl:flex-row mx-4">
					<div className="mx-4 my-2">
						<FormRow
							type="text"
							name="subject"
							labelText="Subject"
							placeholder="subject"
							onChange={onSubjectChanged}
						/>
					</div>

					<div className="mx-4 my-2">
						<FormRow
							type="text"
							name="school"
							labelText="School Name"
							placeholder="school name"
							onChange={onSchoolChanged}
						/>
					</div>
					<button
						type="submit"
						className="h-8 w-full 2xl:w-60 mt-8 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
					>
						{isSubmitting ? 'submitting...' : 'create'}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default AddClassForm;
