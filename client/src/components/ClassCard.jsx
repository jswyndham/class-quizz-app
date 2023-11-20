import { FaLocationArrow, FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Form } from 'react-router-dom';
import ClassInfo from './ClassInfo';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const ClassCard = ({ _id, className, subject, school, classStatus }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	return (
		<div className="max-w-lg min-w-md h-80 my-12 md:m-12 shadow-lg shadow-gray-400">
			<header className="h-32 bg-orange-300 p-6">
				<div className="">
					<h3 className="mb-3 text-4xl text-white font-bold">
						{className}
					</h3>
					<p className="text-xl italic font-sans">{subject}</p>
				</div>
			</header>
			<div className="flex flex-col p-6">
				<ClassInfo icon={<FaSchool />} text={school} />
				<ClassInfo icon={<FaCalendarAlt />} text={classStatus} />
			</div>
		</div>
	);
};

export default ClassCard;
