import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef } from 'react';
import { ClassInfo, ConfirmModal } from './';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Link, redirect, useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

dayjs.extend(advancedFormat);

const ClassCard = ({ _id, className, subject, school, classStatus }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	// STATE
	const [showClassCardMenu, setShowClassCardMenu] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const navigate = useNavigate();

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

	// HANDLERS
	const toggleCardMenu = () => {
		setShowClassCardMenu(!showClassCardMenu);
	};

	const handleDelete = () => {
		try {
			customFetch.delete(`/class/${_id}`);
			setShowConfirmModal(false);
			navigate('/dashboard');
			toast.success('Job deleted');
		} catch (error) {
			toast.error(error?.response?.data?.msg);
		}
		return navigate('/dashboard');
	};

	return (
		<>
			{/* CLASS CARD */}

			<div className="w-full h-60 my-4 shadow-lg shadow-gray-400">
				<header className="flex flex-row justify-between h-fit bg-third px-12 py-5">
					<Link to={`/dashboard/classlayout/${_id}`}>
						<div className="">
							<h3 className="mb-2 text-2xl lg:text-3xl text-white font-bold">
								{className}
							</h3>
							<p className="text-lg lg:text-xl italic font-sans ml-4">
								{subject}
							</p>
						</div>
					</Link>
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
							<li className="m-2 text-yellow-600 hover:text-yellow-400">
								<Link
									to={`/dashboard/edit-class/${_id}`}
									onClick={toggleCardMenu}
								>
									edit
								</Link>
							</li>
							<li className="m-2 hover:text-red-500 text-red-700">
								<button
									onClick={() => setShowConfirmModal(true)}
								>
									Delete
								</button>
							</li>
						</ul>
					</div>
				</article>
			</section>
			<div className="z-50">
				<ConfirmModal
					isOpen={showConfirmModal}
					onConfirm={handleDelete}
					onCancel={() => setShowConfirmModal(false)}
					message="Are you sure you want to permanently delete this class?"
				/>
			</div>
		</>
	);
};

export default ClassCard;
