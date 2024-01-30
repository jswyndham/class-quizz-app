import ClassForm from '../components/classComponents/ClassForm';
import classHooks from '../hooks/ClassHooks';
import { useDispatch } from 'react-redux';
import { createClass, fetchClasses } from '../features/classGroup/classAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddClass = () => {
	const { setClassSchool, setClassName, setClassSubject, classGroup } =
		classHooks({});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Submit and create new class group
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await dispatch(createClass(classGroup)).unwrap();
			dispatch(fetchClasses());
			navigate('/dashboard');
			toast.success('Class successfully added');
		} catch (error) {
			console.error('Failed to create class:', error);
			toast.error('Failed to create class');
		}
	};

	return (
		<section className="flex justify-center align-middle w-full h-full bg-secondary pt-32">
			<article className="flex flex-col w-full overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Add Class
					</h1>
				</div>
				<ClassForm
					classKey={classGroup._id}
					onSubmit={handleSubmit}
					nameRow={setClassName}
					nameValue={classGroup.className}
					subjectRow={setClassSubject}
					subjectValue={classGroup.subject}
					schoolRow={setClassSchool}
					schoolValue={classGroup.school}
				/>
			</article>
		</section>
	);
};

export default AddClass;
