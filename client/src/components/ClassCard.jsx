import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ClassInfo, ConfirmDeleteModal } from './';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';
import CardModal from './CardModal';
import { deleteClass, fetchClasses } from '../features/classGroup/classAPI';
import { toast } from 'react-toastify';

dayjs.extend(advancedFormat);

const ClassCard = ({ _id, className, classStatus, school, subject }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	// STATE
	const [isClassCardMenu, setIsClassCardMenu] = useState(false);

	const [confirmModalState, setConfirmModalState] = useState({
		isOpen: false,
		classId: null,
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();
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
	const openConfirmModal = useCallback((classId) => {
		setConfirmModalState({ isOpen: true, classId });
	}, []);

	const closeConfirmModal = useCallback(() => {
		setConfirmModalState({ isOpen: false, classId: null });
	}, []);

	const handleMenuClick = (e) => {
		e.stopPropagation();
		setIsClassCardMenu(!isClassCardMenu);
	};

	const handleEditClick = (e) => {
		e.stopPropagation();
		navigate(`/dashboard/edit-class/${_id}`);
	};

	const handleDeleteClick = async (e) => {
		e.stopPropagation();
		try {
			await dispatch(deleteClass(_id));
			closeConfirmModal();
			dispatch(fetchClasses());
			navigate('/dashboard');
			toast.success('Class deleted');
		} catch (error) {
			toast.error(error?.response?.data?.msg);
		}
	};

	const handleLink = (e) => {
		e.stopPropagation();
		navigate(`/dashboard/classlayout/${_id}`);
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
				</header>
				<div className="absolute w-14 h-8 right-8 top-5 bg-black bg-opacity-20 rounded-md">
					<button
						ref={menuRef}
						className="absolute z-10 text-white -mt-2 ml-1 text-5xl font-bold hover:cursor-pointer"
						onClick={handleMenuClick}
					>
						<PiDotsThreeBold />
					</button>
				</div>
				<div className="flex flex-col p-6">
					<ClassInfo icon={<FaSchool />} text={school} />
					<ClassInfo icon={<FaCalendarAlt />} text={classStatus} />
				</div>
				{/* CARD MENU */}
				<div
					onClick={handleMenuClick}
					className="absolute right-8 top-4"
				>
					<CardModal
						isShowClassMenu={isClassCardMenu}
						handleEdit={handleEditClick}
						handleDelete={openConfirmModal}
						id={_id}
					/>
				</div>
			</article>

			{/* DROP MENU MODAL */}

			{confirmModalState.isOpen && (
				<ConfirmDeleteModal
					isOpen={confirmModalState.isOpen}
					onConfirm={handleDeleteClick}
					onCancel={closeConfirmModal}
					message="Are you sure you want to delete this class?"
				/>
			)}
		</>
	);
};

export default ClassCard;
