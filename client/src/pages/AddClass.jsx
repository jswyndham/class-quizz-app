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
		<section className="flex justify-center align-middle w-screen md:w-full h-full bg-gradient-to-br from-white via-slate-200 to-secondary">
			<article className="flex flex-col w-full xl:w-11/12 2xl:w-9/12 4xl:w-6/12">
				<div className="relative h-36 mt-24 lg:mt-36 2xl:ml-36">
					<div className="-mt-3 w-24 h-24 m-5 pl-6 bg-forth rounded-xl drop-shadow-2xl"></div>
					<div className="absolute -top-4 left-12 w-40 h-56 m-5 pl-6 bg-primary rounded-md shadow-xl shadow-slate-500">
						<h1 className="text-third text-4xl md:text-5xl font-thin tracking-tighter">
							add
						</h1>
						<h1 className="text-forth font-roboto font-bold text-7xl tracking-widest">
							CLASS
						</h1>
					</div>
				</div>
				<div className="z-10 flex justify-center -mt-6 md:mt-0">
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
				</div>
			</article>
		</section>
	);
};

export default AddClass;
