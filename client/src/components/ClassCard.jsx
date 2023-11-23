import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, createContext, useContext } from 'react';
import { Link, Form } from 'react-router-dom';
import ClassInfo from './ClassInfo';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import ClassCardMenu from './ClassCardMenu';

dayjs.extend(advancedFormat);

const ClassCardContext = createContext();

const ClassCard = ({ _id, className, subject, school, classStatus }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	const [showClassCardMenu, setShowClassCardMenu] = useState(false);

	const toggleCardMenu = () => {
		setShowClassCardMenu(!showClassCardMenu);
	};

	return (
		<ClassCardContext.Provider
			value={{
				showClassCardMenu,
				setShowClassCardMenu,
				toggleCardMenu,
			}}
		>
			<div className="w-full h-60 my-4 shadow-lg shadow-gray-400">
				<header className="flex flex-row justify-between h-fit bg-third px-12 py-5">
					<div className="">
						<h3 className="mb-2 text-2xl lg:text-3xl text-white font-bold">
							{className}
						</h3>
						<p className="text-lg lg:text-xl italic font-sans ml-4">
							{subject}
						</p>
					</div>
					<div className="">
						<button
							className="text-white text-3xl font-bold hover:cursor-pointer"
							onClick={toggleCardMenu}
						>
							<PiDotsThreeBold />
						</button>
					</div>
				</header>

				<div className="flex flex-col p-6">
					<ClassInfo icon={<FaSchool />} text={school} />
					<ClassInfo icon={<FaCalendarAlt />} text={classStatus} />
				</div>
			</div>
			<div className="flex flex-row-reverse -mt-60 mr-12 z-10">
				<ClassCardMenu />
			</div>
		</ClassCardContext.Provider>
	);
};

export const useClassCardContext = () => useContext(ClassCardContext);
export default ClassCard;
