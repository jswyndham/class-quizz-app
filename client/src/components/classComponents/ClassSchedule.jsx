import { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { FormRow, FormRowSelect } from '../components';
import 'react-datepicker/dist/react-datepicker.css';

const SchedulePage = () => {
	const [classes, setClasses] = useState([]);
	const days = Object.values(DAYS_OF_THE_WEEK).map((day) => day.label);
	const hours = [
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
	];

	useEffect(() => {
		// Fetch class data from the database
		// Transform it to a suitable format for the schedule grid
		// For example:
		// [
		//   { name: 'Math', dayOfTheWeek: 'Monday', startTime: '09:00', endTime: '10:00' },
		//   { name: 'Science', dayOfTheWeek: 'Tuesday', startTime: '10:00', endTime: '11:00' }
		// ]
		// setClasses(transformedData);
	}, []);

	// Function to format the time for comparison
	const formatTime = (time) => time.slice(0, 5);

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-[auto_repeat(5,_1fr)] gap-4">
				<div className="bg-gray-200 p-4"></div>
				{days.map((day) => (
					<div key={day} className="bg-gray-200 p-4 text-center">
						{day}
					</div>
				))}
				{hours.map((hour) => (
					<>
						<div key={hour} className="bg-gray-200 p-4 text-right">
							{hour}
						</div>
						{days.map((day) => (
							<div
								key={day + hour}
								className="border border-gray-300 p-4"
							>
								{classes
									.filter(
										(cls) =>
											cls.dayOfTheWeek === day &&
											formatTime(
												cls.classTime.start.toISOString()
											) === hour
									)
									.map((cls) => (
										<div key={cls.name}>{cls.name}</div>
									))}
							</div>
						))}
					</>
				))}
			</div>
		</div>
	);
};

export default SchedulePage;
