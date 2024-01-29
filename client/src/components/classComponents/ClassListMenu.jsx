import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ClassListCard from './ClassListCard';
import { fetchClasses } from '../../features/classGroup/classAPI';
import LoadingSpinner from '../LoadingSpinner';
import AddButton from '../AddButton';
import ButtonMenu from '../ButtonMenu';
import { MdOutlineAddHome } from 'react-icons/md';
import { IoPeopleSharp } from 'react-icons/io5';
import JoinClassModal from '../JoinClassModal';
import { selectClassDataArray } from '../../features/classGroup/classSelectors';

const MemoizedClassListCard = memo(ClassListCard);

const ClassListMenu = () => {
	console.log('ClassListMenu rendered');

	// Manage the visibility of the card menu
	const [isCardMenu, setIsCardMenu] = useState(false);
	const [isJoinModal, setIsJoinModal] = useState(false);

	const classData = useSelector(selectClassDataArray);

	const currentUser = useSelector(
		(state) => state.user.currentUser,
		shallowEqual
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const menuRef = useRef();

	// Access userStatus to determin user access
	const userRole = currentUser?.userStatus;

	useEffect(() => {
		console.log('Dispatching fetchClasses - CLassListMenu');
		dispatch(fetchClasses());
	}, [dispatch]);

	// Click outside the card menu to close
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

	// Toggles the card menu visibility
	const handleButtonMenuClick = (e) => {
		e.stopPropagation();
		setIsCardMenu(!isCardMenu);
	};

	const handleStudentJoinButton = (e) => {
		e.stopPropagation();
		setIsJoinModal(!isJoinModal);
	};

	const handleCreateClassButton = (e) => {
		e.stopPropagation();
		navigate('/dashboard/add-class');
	};

	// Handlers
	const handleClassLink = (_id) => {
		navigate(`/dashboard/class/${_id}`);
	};

	// Map list of class groups
	return (
		<>
			<article className="invisible md:visible md:transition-transform md:duration-300 fixed flex-shrink-0 w-64 h-screen mt-24 py-4 px-1 border-r-2 bg-zinc-200 border-third shadow-md shadow-slate-300">
				{userRole === 'STUDENT' ? (
					<AddButton
						text="Join class"
						handleAdd={handleStudentJoinButton}
					/>
				) : (
					<AddButton text="Class" handleAdd={handleButtonMenuClick} />
				)}

				{(userRole === 'TEACHER' || userRole === 'ADMIN') && (
					<div
						ref={menuRef}
						onClick={handleButtonMenuClick}
						className="absolute right-1 top-16 mt-1"
					>
						<ButtonMenu
							isShowButtonMenu={isCardMenu}
							iconOne={<MdOutlineAddHome />}
							textOne={'Create new class'}
							onClickMenuOne={handleCreateClassButton}
							iconTwo={<IoPeopleSharp />}
							textTwo={'Join class'}
							// onClickMenuTwo={}
						/>
					</div>
				)}

				<div className="m-2 border-t border-slate-400">
					<h2 className="pt-4 font-quizgate text-2xl tracking-wide">
						Class List
					</h2>
				</div>
				<div className="w-full h-fit grid grid-cols-1">
					{Array.isArray(classData) &&
						classData.map((classGroup) => (
							<MemoizedClassListCard
								key={classGroup._id}
								clickClassListCard={() =>
									handleClassLink(classGroup._id)
								}
								className={classGroup.className}
								subject={classGroup.subject}
							/>
						))}
				</div>
			</article>
			{/* Delete quiz modal */}
			{isJoinModal && (
				<JoinClassModal
					isOpen={isJoinModal}
					// onConfirm={handleDeleteClick}
					// onCancel={closeConfirmModal}
					heading="Join a class"
					message="Enter a join code to become a class group member. Class codes can be provide by the class administrator."
				/>
			)}
		</>
	);
};

export default ClassListMenu;
