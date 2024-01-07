import ClassForm from '../components/classComponents/ClassForm';
import classHooks from '../hooks/ClassHooks';
import { useDispatch } from 'react-redux';
import { createClass } from '../features/classGroup/classAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddClass = () => {
	const {
		onNameChanged,
		onSubjectChanged,
		onSchoolChanged,
		onClassStatusChanged,
		className,
		subject,
		classStatus,
		school,
	} = classHooks({});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// SUBMIT
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await dispatch(
				createClass({ className, subject, classStatus, school })
			).unwrap();
			navigate('/dashboard');
			toast.success('Class successfully added');
		} catch (error) {
			console.error('Failed to create class:', error);
			toast.error('Failed to create class');
		}
	};

	return (
		<section className="flex justify-center align-middle w-screen h-screen bg-secondary mt-24 md:my-16 pt-4 md:pt-12 ">
			<article className="flex flex-col w-screen h-full overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Add Class
					</h1>
				</div>
				<ClassForm
					onSubmit={handleSubmit}
					nameRow={onNameChanged}
					classStatusRow={onClassStatusChanged}
					subjectRow={onSubjectChanged}
					schoolRow={onSchoolChanged}
				/>
			</article>
		</section>
	);
};

export default AddClass;
