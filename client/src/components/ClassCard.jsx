import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
// import { Link, Form } from "react-router-dom";
import ClassInfo from './ClassInfo';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Link } from 'react-router-dom';

dayjs.extend(advancedFormat);

const ClassCardContext = createContext();

const ClassCard = ({ _id, className, subject, school, classStatus }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	const [showClassCardMenu, setShowClassCardMenu] = useState(false);

	const menuRef = useRef();

	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (
				!showClassCardMenu &&
				menuRef.current &&
				!menuRef.current.contains(e.target)
			) {
				setShowClassCardMenu(false);
			}
		};
		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, []);

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
			{/* CLASS CARD */}
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
							ref={menuRef}
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

			{/* CARD MENU */}
			<section className="flex flex-row-reverse -mt-60 mr-12 z-10">
				<article className={showClassCardMenu ? 'flex' : 'hidden'}>
					<div
						className={
							'w-fit h-fit bg-white p-6 rounded-lg shadow-xl shadow-gray-800 drop-shadow-lg transition-all ease-in-out duration-300 top-0 z-50'
						}
					>
						<ul className="text-xl">
							<li className="m-2 hover:text-gray-500">
								<button onClick={toggleCardMenu}>
									duplicate
								</button>
							</li>
							<li className="m-2 hover:text-gray-500">
								<Link
									to={`/dashboard/edit-class/${_id}`}
									onClick={toggleCardMenu}
								>
									edit
								</Link>
							</li>
							<li className="m-2 hover:text-red-500 text-red-700">
								<button onClick={toggleCardMenu}>delete</button>
							</li>
						</ul>
					</div>
				</article>
			</section>
		</ClassCardContext.Provider>
	);
};

export const useClassCardContext = () => useContext(ClassCardContext);
export default ClassCard;
