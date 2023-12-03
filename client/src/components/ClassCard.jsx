import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { ClassInfo, ConfirmDeleteModal } from './';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';
import CardModal from './CardModal';
import { deleteClass } from '../features/classGroup/classAPI';
import { toast } from 'react-toastify';

dayjs.extend(advancedFormat);

const ClassCard = memo(({ _id, className, subject, school, classStatus }) => {
	//const date = day(createdAt).format('YYYY-MM-DD');

	// openConfirmModal

	// STATE
	const [isClassCardMenu, setIsClassCardMenu] = useState(false);

	const [confirmModalState, setConfirmModalState] = useState({
		isOpen: false,
		classId: null,
	});

	const navigate = useNavigate();

	const menuRef = useRef();

	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (
				!isClassCardMenu &&
				menuRef.current &&
				!menuRef.current.contains(e.target)
			) {
				console.log('Clicked outside the menu');
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
		console.log('Modal was opened');
		setConfirmModalState({ isOpen: true, classId });
	}, []);

	const closeConfirmModal = useCallback(() => {
		console.log('Modal was closed');
		setConfirmModalState({ isOpen: false, classId: null });
	}, []);

	const handleMenuClick = (e) => {
		e.stopPropagation();
		console.log('Menu Clicked, isClassCardMenu:', !isClassCardMenu);
		setIsClassCardMenu(!isClassCardMenu);
	};

	const handleEditClick = (e) => {
		e.stopPropagation();
		console.log('Edit was clicked');
		navigate(`/dashboard/edit-class/${_id}`);
	};

	const handleDeleteClick = async (classId, e) => {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
		console.log('handleDelete was clicked');
		try {
			await dispatch(deleteClass(classId));
			console.log('dispatch triggered');
			closeConfirmModal();
			toast.success('Class deleted');
		} catch (error) {
			toast.error(error?.response?.data?.msg);
		}
		return navigate('/dashboard');
	};

	const handleLink = (e) => {
		e.stopPropagation();
		console.log('HandleLink was clicked');
		navigate(`/dashboard/classlayout/${_id}`);
	};

	return (
		<>
			{/* CLASS CARD */}

			<article className="relative w-full h-60 my-4 shadow-lg shadow-gray-400 hover:cursor-pointer">
				<header
					onClick={handleLink}
					className="relative flex flex-row justify-between h-fit bg-third px-12 py-5"
				>
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
			</article>

			{/* CARD MENU */}
			<div className="absolute right-24 top-44">
				<CardModal
					isShowClassMenu={isClassCardMenu}
					handleEdit={handleEditClick}
					handleDelete={openConfirmModal}
					id={_id}
				/>
			</div>
			{/* DROP MENU MODAL */}

			{confirmModalState.isOpen && (
				<ConfirmDeleteModal
					isOpen={confirmModalState.isOpen}
					onConfirm={() => handleDeleteClick(confirmModalState._id)}
					onCancel={closeConfirmModal}
					message="Are you sure you want to delete this class?"
				/>
			)}
		</>
	);
});

export default ClassCard;
