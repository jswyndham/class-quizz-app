import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef } from 'react';
import { ClassInfo, ConfirmModal } from './';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import CardModal from './CardModal';

dayjs.extend(advancedFormat);

const ClassCard = ({ _id, className, subject, school, classStatus }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	// STATE
	const [isClassCardMenu, setIsClassCardMenu] = useState(false);
	const [isConfirmModal, setIsConfirmModal] = useState(false);

	const navigate = useNavigate();

	const menuRef = useRef();

	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (
				!isClassCardMenu &&
				menuRef.current &&
				!menuRef.current.contains(e.target)
			) {
				setIsClassCardMenu(false);
			}
		};
		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, []);

	// HANDLERS

	const handleLink = () => {
		navigate(`/dashboard/classlayout/${_id}`);
	};

	const handleMenuClick = (e) => {
		e.stopPropagation();
		setIsClassCardMenu(!isClassCardMenu);
	};

	const handleEditClick = () => {
		navigate(`/dashboard/edit-class/${id}`);
	};

	const handleDelete = () => {
		try {
			customFetch.delete(`/class/${_id}`);
			setIsConfirmModal(false);
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

			<article
				onClick={handleLink}
				className="relative w-full h-60 my-4 shadow-lg shadow-gray-400 hover:cursor-pointer"
			>
				<header className="relative flex flex-row justify-between h-fit bg-third px-12 py-5">
					<div className="">
						<h3 className="mb-2 text-2xl lg:text-3xl text-white font-bold">
							{className}
						</h3>
						<p className="text-lg lg:text-xl italic font-sans ml-4">
							{subject}
						</p>
					</div>

					<div className="relative w-14 h-8 bg-black bg-opacity-20 rounded-md">
						<button
							ref={menuRef}
							className="absolute z-10 text-white -mt-2 ml-1 text-5xl font-bold hover:cursor-pointer"
							onClick={handleMenuClick}
						>
							<PiDotsThreeBold />
						</button>

						{/* CARD MENU */}
						<CardModal
							isShowClassMenu={isClassCardMenu}
							handleEdit={handleEditClick}
							isDelete={setIsConfirmModal}
							id={_id}
						/>
					</div>
				</header>

				<div className="flex flex-col p-6">
					<ClassInfo icon={<FaSchool />} text={school} />
					<ClassInfo icon={<FaCalendarAlt />} text={classStatus} />
				</div>
			</article>

			{/* DROP MENU MODAL */}
			<div className="z-50">
				<ConfirmModal
					isOpen={isConfirmModal}
					onConfirm={handleDelete}
					onCancel={() => setIsConfirmModal(false)}
					message="Are you sure you want to permanently delete this class?"
				/>
			</div>
		</>
	);
};

export default ClassCard;
