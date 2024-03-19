import { Form } from 'react-router-dom';
import { FormRow, FormRowSelect } from '..';
import { useNavigation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DAYS_OF_THE_WEEK } from '../../../../server/utils/constants';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

const ClassForm = ({
	onSubmit,
	nameRow,
	classKey,
	subjectRow,
	schoolRow,
	nameValue,
	subjectValue,
	schoolValue,
	dayOfTheWeekRow,
	dayOfTheWeekValue,
}) => {
	const navigation = useNavigation();
	const isLoading = useSelector((state) => state.class.loading);

	// State to handle class times
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [is24Hour, setIs24Hour] = useState(false); // false for 12-hour format

	// Handle 12-24 hour schedule
	const handleFormatToggle = () => {
		setIs24Hour(!is24Hour);
	};

	return (
		<section className="w-full h-full max-w-lg mx-3 my-6 rounded-lg bg-white flex justify-center border border-slate-400 shadow-xl shadow-slate-500">
			<Form
				method="post"
				key={classKey}
				onSubmit={onSubmit}
				className="w-11/12 flex flex-col justify-center px-4 py-10 drop-shadow-lg"
			>
				<div className="w-full ml-2 my-2">
					<label className="ml-4 font-robotoCondensed text-lg lg:text-xl">
						Class Title
					</label>
					<FormRow
						type="text"
						placeholder="class title"
						onChange={nameRow}
						value={nameValue}
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
							onChange={subjectRow}
							value={subjectValue}
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
							onChange={schoolRow}
							value={schoolValue}
						/>
					</div>

					{/* ******** Day of the Week Dropdown ******** */}
					<div className="w-full my-2">
						<label className="ml-4 font-robotoCondensed text-lg lg:text-xl">
							Day of the Week
						</label>
						<FormRowSelect
							list={Object.values(DAYS_OF_THE_WEEK).map(
								(type) => ({
									label: type.label,
									value: type.value,
								})
							)}
							value={dayOfTheWeekValue}
							onChange={dayOfTheWeekRow}
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
								onClick={handleFormatToggle}
								type="checkbox"
								className="w-6 h-6 mr-4 checked:bg-blue-500 border border-slate-300"
							/>
							<label className="">
								Check to use 24-hour time
							</label>
						</div>

						{/* Class Start Time Dropdown */}
						<div className="w-full p-2 ml-2 my-3 bg-slate-200 rounded-lg">
							<label className="mr-2">Start Time:</label>
							<ReactDatePicker
								selected={startTime}
								onChange={(date) => setStartTime(date)}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={10}
								timeCaption="Time"
								dateFormat={is24Hour ? 'HH:mm' : 'h:mm aa'}
								className="py-1 px-2 rounded-md"
							/>
						</div>

						{/* Class End Time Dropdown */}
						<div className="w-full p-2 ml-2 my-3 bg-slate-200 rounded-lg">
							<label className="mr-4">End Time:</label>
							<ReactDatePicker
								selected={endTime}
								onChange={(date) => setEndTime(date)}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={10}
								timeCaption="Time"
								dateFormat={is24Hour ? 'HH:mm' : 'h:mm aa'}
								className="py-1 px-2 rounded-md"
							/>
						</div>
					</article>

					<button
						type="submit"
						className="h-10 w-11/12 2xl:w-60 mt-10  bg-blue-400 text-white text-lg font-bold rounded-lg ml-2 drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
					>
						{isLoading ? 'submitting...' : 'submit'}
					</button>
				</div>
			</Form>
		</section>
	);
};

export default ClassForm;
