import { DAYS_OF_THE_WEEK } from '../../../server/utils/constants';
import customFetch from '../utils/customFetch';

// ************ React *************************
import { useEffect } from 'react';
import classHooks from '../hooks/ClassHooks';
import { useLoaderData, Form, useNavigate, useParams } from 'react-router-dom';

//  ************ Redux ********************
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses, updateClass } from '../features/classGroup/classAPI';

// ************* React components *************
import ReactDatePicker from 'react-datepicker';
import { FormRow, FormRowSelect } from '../components';
import { toast } from 'react-toastify';

//  ********* Loader **************
export const loader = async ({ params }) => {
	try {
		const { data } = await customFetch.get(`/class/${params.id}`);

		return data; // Return only the quiz object
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return redirect('/dashboard');
	}
};

const EditClass = () => {
	const classData = useLoaderData();

	// ************** Imported quiz hooks ****************

	const {
		startTime,
		setStartTime,
		endTime,
		setEndTime,
		classGroup,
		setClassGroup,
		setIs24HourSetting,
		setClassName,
		setClassSubject,
		setClassSchool,
		setDayOfTheWeek,
	} = classHooks(classData.classGroup);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLoading = useSelector((state) => state.class.loading);

	useEffect(() => {
		console.log('useEffect Day (AddClass):', classGroup.dayOfTheWeek);
	}, [classGroup.dayOfTheWeek]);

	if (!classData) {
		// Handle the case where classData is not yet available
		// For example, render a loading spinner or a message
		return <div>Loading...</div>;
	}

	//  ****************** HANDLERS ***********************

	// Handle quiz title
	const handleClassNameChange = (e) => {
		setClassName(e.target.value);
	};

	// Handle quiz title
	const handleSubjectChange = (e) => {
		setClassSubject(e.target.value);
	};

	// Handle quiz title
	const handleSchoolNameChange = (e) => {
		setClassSchool(e.target.value);
	};

	const handleIs24HourChange = (e) => {
		setIs24HourSetting(e.target.checked);
	};

	// Handle quiz title
	const handleDayOfTheWeekChange = (e) => {
		setDayOfTheWeek(e.target.value);
	};

	const handleChange = (field, value) => {
		setClassGroup((prevClassGroup) => ({
			...prevClassGroup,
			[field]: value,
		}));
	};

	const handleDayChange = (e) => {
		handleChange('dayOfTheWeek', e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Extract the class ID from the loaded data
		const classId = classData.classGroup._id;

		console.log('Updating class ID:', classId);

		const updatedClassData = {
			className: classGroup.className,
			subject: classGroup.subject,
			school: classGroup.school,
			dayOfTheWeek: classGroup.dayOfTheWeek,
			is24Hour: Boolean(classGroup.is24Hour),
			classTime: {
				start: startTime.toISOString(),
				end: endTime.toISOString(),
			},
		};

		console.log('Class Data:', classData);
		console.log('Class Group:', classGroup);
		console.log('Sending Updated Class Data:', updatedClassData);

		try {
			await dispatch(updateClass({ classId, updatedClassData })).unwrap();
			dispatch(fetchClasses());
			navigate('/dashboard');
			toast.success('Class successfully updated');
		} catch (error) {
			console.error('Failed to update class:', error);
			toast.error('Failed to update class');
		}
	};

	return (
		<section className="flex justify-center align-middle w-screen md:w-full h-full bg-gradient-to-br from-white via-slate-200 to-secondary">
			<article className="flex flex-col w-full xl:w-11/12 2xl:w-9/12 4xl:w-6/12">
				<article className="relative h-36 mt-24 lg:mt-36 2xl:ml-36">
					<div className="-mt-3 w-24 h-24 m-5 pl-6 bg-forth rounded-xl drop-shadow-2xl"></div>
					<div className="absolute -top-4 left-12 w-40 h-56 m-5 pl-6 bg-primary rounded-md shadow-xl shadow-slate-500">
						<h1 className="text-third text-4xl md:text-5xl font-thin tracking-tighter">
							edit
						</h1>
						<h1 className="text-forth font-roboto font-bold text-7xl tracking-widest">
							CLASS
						</h1>
					</div>
				</article>
				<article className="z-10 flex justify-center -mt-6 md:mt-0">
					<div className="w-full h-full max-w-lg mx-3 my-6 rounded-lg bg-white flex justify-center border border-slate-400 shadow-xl shadow-slate-500">
						<Form
							method="post"
							key={classGroup._id}
							onSubmit={handleSubmit}
							className="w-11/12 flex flex-col justify-center px-4 py-10 drop-shadow-lg"
						>
							<div className="w-full ml-2 my-2">
								<label className="ml-4 font-robotoCondensed text-lg lg:text-xl">
									Class Title
								</label>
								<FormRow
									type="text"
									placeholder="class title"
									onChange={handleClassNameChange}
									value={classGroup.className}
								/>
							</div>

							<div className="w-full flex flex-col">
								{/* ******** Subject Type ******** */}
								<div className="w-full ml-2 my-2">
									<label className="ml-4 font-robotoCondensed text-lg lg:text-xl">
										Subject
									</label>
									<FormRow
										type="text"
										placeholder="subject"
										onChange={handleSubjectChange}
										value={classGroup.subject}
									/>
								</div>

								{/* ******** School Name ******** */}
								<div className="w-full ml-2 my-2">
									<label className="ml-4 font-robotoCondensed text-lg lg:text-xl">
										School Name
									</label>
									<FormRow
										type="text"
										placeholder="school name"
										onChange={handleSchoolNameChange}
										value={classGroup.school}
									/>
								</div>

								{/* ******** Day of the Week Dropdown ******** */}
								<div className="w-full my-2">
									<label className="ml-4 font-robotoCondensed text-lg lg:text-xl">
										Day of the Week
									</label>
									<FormRowSelect
										list={Object.values(
											DAYS_OF_THE_WEEK
										).map((day) => ({
											label: day.label,
											value: day.value,
										}))}
										onChange={handleDayOfTheWeekChange}
										value={classGroup.dayOfTheWeek}
									/>
								</div>

								{/* ********* Class Time ********* */}
								<article className="relative bg-slate-100 mt-6 lg:mx-2 p-4 shadow-none">
									<p className="absolute bg-slate-100 px-3 font-robotoCondensed text-lg lg:text-xl -top-3 rounded-md shadow-none">
										Class Time
									</p>
									{/* Toggle Button */}
									<div className="flex flex-row m-4 justify-start">
										<input
											onChange={handleIs24HourChange}
											checked={classGroup.is24Hour}
											type="checkbox"
											className="w-6 h-6 mr-4 checked:bg-blue-500 border border-slate-300"
										/>
										<label className="">
											Check to use 24-hour time
										</label>
									</div>

									{/* Class Start Time Dropdown */}
									<div className="relative z-50 my-datepicker-container w-full p-2 ml-2 my-3 bg-slate-200 rounded-lg">
										<label className="mr-2">
											Start Time:
										</label>
										<ReactDatePicker
											selected={startTime}
											onChange={setStartTime}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={10}
											timeCaption="Time"
											dateFormat={
												classGroup.is24Hour
													? 'HH:mm'
													: 'h:mm aa'
											}
											className="relative py-1 px-2 rounded-md z-50"
											value={classGroup.classTime}
										/>
									</div>

									{/* Class End Time Dropdown */}
									<div className="end-time-picker relative w-full p-2 ml-2 my-3 bg-slate-200 rounded-lg">
										<label className="mr-4">
											End Time:
										</label>
										<ReactDatePicker
											selected={endTime}
											onChange={setEndTime}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={10}
											timeCaption="Time"
											dateFormat={
												classGroup.is24Hour
													? 'HH:mm'
													: 'h:mm aa'
											}
											value={classGroup.classTime}
											className="relative py-1 px-2 rounded-md"
										/>
									</div>
								</article>

								<button
									type="submit"
									className="z-0 h-10 w-11/12 2xl:w-60 mt-10  bg-blue-400 text-white text-lg font-bold rounded-lg ml-2 drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
								>
									{isLoading ? 'submitting...' : 'submit'}
								</button>
							</div>
						</Form>
					</div>
				</article>
			</article>
		</section>
	);
};

export default EditClass;
