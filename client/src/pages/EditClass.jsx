import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import ClassForm from '../components/classComponents/ClassForm';
import { useDispatch, useSelector } from 'react-redux';
import classHooks from '../hooks/ClassHooks';
import {
	fetchClassById,
	fetchClasses,
	updateClass,
} from '../features/classGroup/classAPI';
import { useEffect } from 'react';

const EditClass = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const classData = useSelector((state) => state.class.classesById[id]);
	const isLoading = useSelector((state) => state.class.loading);
	const error = useSelector((state) => state.class.error);

	useEffect(() => {
		if (!classData) {
			dispatch(fetchClassById(id));
		}
	}, [id, classData, dispatch]);

	// Always call hooks at the top level
	const { setClassSchool, setClassName, setClassSubject, classGroup } =
		classHooks(classData || {});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!classData) return;

		const formData = {
			className: classGroup.className,
			subject: classGroup.subject,
			school: classGroup.school,
		};

		try {
			await dispatch(
				updateClass({ _id: id, classData: formData })
			).unwrap();
			dispatch(fetchClasses());
			navigate('/dashboard');
			toast.success('Class successfully updated');
		} catch (error) {
			console.error('Failed to update class:', error);
			toast.error('Failed to update class');
		}
	};
	if (isLoading) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>Loading...</p>
			</div>
		);
	}

	if (error)
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-red-700">
				<p>Error: {error}</p>
			</div>
		);

	if (!classData) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>No quiz available.</p>
			</div>
		);
	}

	return (
		<section className="flex justify-center align-middle w-screen h-screen bg-secondary mt-24 md:my-16 pt-4 md:pt-12 ">
			<article className="flex flex-col w-screen h-full overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Edit Class
					</h1>
				</div>
				<ClassForm
					classKey={classData._id}
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

export default EditClass;
