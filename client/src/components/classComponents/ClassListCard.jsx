import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';

dayjs.extend(advancedFormat);

// Accessing props from the parent component, ClassListMenu
const ClassListCard = ({ _id, className, subject }) => {
	const classData = useSelector((state) => state.class.class);

	const navigate = useNavigate();

	// Handlers
	const handleLink = () => {
		navigate(`/dashboard/class/${_id}`);
	};

	return (
		<>
			{/* Class List Menu */}
			<article
				onClick={() => handleLink(_id)}
				className="relative w-full h-fit my-1 border border-forth shadow-sm shadow-gray-400 rounded-sm hover:cursor-pointer hover:bg-white"
			>
				<div className="flex flex-col h-fit p-2">
					<h3 className="text-md text-forth font-bold">
						{className}
					</h3>
					<p className="text-sm text-third italic font-sans ml-1">
						{subject}
					</p>
				</div>
			</article>
		</>
	);
};

export default ClassListCard;
