import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import dayjs from 'dayjs'; // Date formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useParams } from 'react-router';
import CardMenu from '../components/CardMenu';
import { toast } from 'react-toastify';
import { fetchClassById } from '../features/classGroup/classAPI';
import { deleteClassMember } from '../features/classGroup/classAPI';

dayjs.extend(advancedFormat);

const MemberCard = ({
	_id,
	firstName,
	lastName,
	email,
	userStatus,
	memberId,
}) => {
	const { id } = useParams(); // ID of the class
	const userId = useSelector((state) => state.user.currentUser?._id); // ID of the current user

	// const membershipId = useSelector(
	// 	(state) => state.membership.currentMembership
	// );

	console.log('class ID: ', id);
	console.log('userId: ', userId);

	// STATE HOOKS
	// Manage the visibility of the card menu
	const [isCardMenu, setIsCardMenu] = useState(false);

	// Manage the delete confirmation modal
	const [confirmModalState, setConfirmModalState] = useState({
		isOpen: false,
		classId: null,
	});

	const [isClassList, setIsClassList] = useState(false);

	const dispatch = useDispatch();
	const menuRef = useRef();

	// Cllick outside the card menu to close
	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.currentTarget)) {
				setIsCardMenu(false);
			}
		};

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, [isCardMenu]);

	// Click outside the 'copy-class list' to close
	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.currentTarget)) {
				setIsClassList(false);
			}
		};

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, [isClassList]);

	// EVENT HANDLERS
	// Opens the delete confirmation modal
	const openConfirmModal = useCallback((classId) => {
		setConfirmModalState({ isOpen: true, classId });
	}, []);

	// Closes the delete confirmation modal
	const closeConfirmModal = useCallback(() => {
		setConfirmModalState({ isOpen: false, classId: null });
	}, []);

	// Toggles the card menu visibility
	const handleMenuClick = (e) => {
		e.stopPropagation();
		setIsCardMenu(!isCardMenu);
	};

	// Handles the deletion of the quiz
	const handleDeleteClick = async (e) => {
		e.stopPropagation();

		try {
			await dispatch(
				deleteClassMember({ userId: memberId, classId: id })
			).unwrap();
			closeConfirmModal();
			await dispatch(fetchClassById(id));
			toast.success('Member removed');
		} catch (error) {
			toast.error(
				error?.response?.data?.msg || 'Failed to remove member'
			);
		}
	};

	return (
		<>
			{/* Quiz card */}

			<article className="relative h-fit w-full lg:max-w-4xl my-2 md:mx-6 lg:mx-12 shadow-md shadow-gray-400 rounded-b-md ">
				<div className="relative flex flex-row justify-between h-fit p-1 border-1 border-slate-300 rounded-t-md">
					<div className="flex flex-col lg:flex-row justify-start lg:justify-between w-full h-full pr-24 bg-slate-200 rounded-md bg-opacity-70">
						<p className="mx-3 mt-1 lg:my-1 text-lg text-forth font-bold hover:cursor-pointer">
							{lastName}, {firstName}
						</p>

						<p className="text-zinc-600 hover:cursor-pointer hover:text-blue-500 active:text-blue-700 pl-3 lg:pl-0 lg:mt-1">
							{email}
						</p>
						<p className="pl-3 pb-1 lg:mt-1 lg:pl-0 lg:pb-0">
							{userStatus}
						</p>
					</div>
				</div>

				{/* options button */}
				<div className="absolute w-12 h-5 mt-1 right-4 top-2 bg-black bg-opacity-30 rounded-md hover:bg-opacity-40">
					<button
						ref={menuRef}
						onClick={handleMenuClick}
						className="absolute text-white -top-2 lg:-top-2 right-1 mr-0.5 lg:right-1 text-4xl font-bold hover:cursor-pointer"
					>
						<PiDotsThreeBold />
					</button>
				</div>

				{/* Quiz card menu */}
				<div
					onClick={handleMenuClick}
					className="absolute right-2 top-2 hover:cursor-pointer text-red-600 "
				>
					<CardMenu
						isShowClassMenu={isCardMenu}
						listNameThree="Remove"
						handleDelete={openConfirmModal}
						id={_id}
						menuConfig={{
							copy: false, // hide the first option
							edit: false, // hide the second option
							delete: true, // show the third option
						}}
						className="hover:rounded-t-lg"
					/>
				</div>
			</article>

			{/* Delete quiz modal */}
			{confirmModalState.isOpen && (
				<ConfirmDeleteModal
					isOpen={confirmModalState.isOpen}
					onConfirm={handleDeleteClick}
					onCancel={closeConfirmModal}
					message="Are you sure you want to remove this member?"
				/>
			)}
		</>
	);
};

export default MemberCard;
