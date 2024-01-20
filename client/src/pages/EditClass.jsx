import { useLoaderData, useNavigate } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import ClassForm from '../components/classComponents/ClassForm';
import { useDispatch } from 'react-redux';
import classHooks from '../hooks/ClassHooks';
import { updateClass } from '../features/classGroup/classAPI';

export const loader = async ({ params }) => {
	try {
		const { data } = await customFetch.get(`/class/${params.id}`);
		return data;
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return redirect('/dashboard');
	}
};

const EditClass = () => {
	const { classGroup } = useLoaderData();

	const {
		onNameChanged,
		onSubjectChanged,
		onSchoolChanged,
		onClassStatusChanged,
		className,
		subject,
		classStatus,
		school,
	} = classHooks(classGroup);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// SUBMIT
	const handleSubmit = async (e) => {
		e.preventDefault();

		const classData = { className, subject, classStatus, school };

		try {
			dispatch(updateClass({ _id: classGroup._id, classData }));
			navigate('/dashboard');
			toast.success('Class successfully updated');
		} catch (error) {
			console.error('Failed to update class:', error);
			toast.error('Failed to update class');
		}
	};

	return (
		<section className="flex justify-center align-middle w-screen h-screen bg-secondary mt-24 md:my-16 pt-4 md:pt-12 ">
			<article className="flex flex-col w-screen h-full overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Edit Class
					</h1>
				</div>
				<ClassForm
					onSubmit={handleSubmit}
					nameRow={onNameChanged}
					classStatusRow={onClassStatusChanged}
					subjectRow={onSubjectChanged}
					schoolRow={onSchoolChanged}
					nameValue={className}
					statusValue={classStatus}
					subjectValue={subject}
					schoolValue={school}
				/>
			</article>
		</section>
	);
};

export default EditClass;
