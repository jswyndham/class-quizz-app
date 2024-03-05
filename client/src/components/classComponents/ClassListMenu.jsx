import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ClassListCard from './ClassListCard';
import {
	fetchClasses,
	joinClassWithCode,
} from '../../features/classGroup/classAPI';
import AddButton from '../AddButton';
import ButtonMenu from '../ButtonMenu';
import { MdOutlineAddHome } from 'react-icons/md';
import { IoPeopleSharp } from 'react-icons/io5';
import JoinClassModal from '../JoinClassModal';
import { selectClassDataArray } from '../../features/classGroup/classSelectors';
import { toast } from 'react-toastify';
import { selectMembershipDataArray } from '../../features/membership/membershipSelectors';
import { fetchMemberships } from '../../features/membership/membershipAPI';

const MemoizedClassListCard = memo(ClassListCard);

const ClassListMenu = () => {
	console.log('ClassListMenu rendered');

	// Manage the visibility of the card menu
	const [isCardMenu, setIsCardMenu] = useState(false);
	const [isJoinModal, setIsJoinModal] = useState(false);
	const [accessCode, setAccessCode] = useState('');

	const classData = useSelector(selectClassDataArray);

	const currentUser = useSelector((state) => state.user.currentUser); // Get current user data
	const membershipData = useSelector(selectMembershipDataArray); // Get membership data

	// Access userStatus to determin user access
	const userRole = currentUser?.userStatus;

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const menuRef = useRef();

	console.log('Selector Output:', membershipData);

	useEffect(() => {
		if (currentUser) {
			dispatch(fetchClasses());
		}
	}, [currentUser, dispatch]);

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

	// *********** HANDLER FUNCTIONS *******************

	// Toggles the card menu visibility
	const handleButtonMenuClick = (e) => {
		e.stopPropagation();
		setIsCardMenu(!isCardMenu);
	};

	const handleJoinButtonOpen = (e) => {
		e.stopPropagation();
		setIsJoinModal(!isJoinModal);
	};

	const handleJoinButtonClose = (e) => {
		e.stopPropagation();
		setIsJoinModal(!isJoinModal);
		setAccessCode(''); // Reset the accessCode state
	};

	const handleCreateClassButton = (e) => {
		e.stopPropagation();
		navigate('/dashboard/add-class');
	};

	const handleClassLink = (_id) => {
		navigate(`/dashboard/class/${_id}`);
	};

	// Handles the submission of the access code for a user to become a member of join a class group
	const handleJoinClass = async (e) => {
		e.preventDefault();
		console.log('Attempting to join class with code:', accessCode); // Log to verify
		try {
			const result = await dispatch(
				joinClassWithCode(accessCode)
			).unwrap();
			setAccessCode(''); // Reset the accessCode state
			handleJoinButtonClose(e);
			dispatch(fetchMemberships());
			toast.success('Successfully joined the class');
		} catch (error) {
			console.error('Failed to join class:', error);
			toast.error(
				error?.response?.data?.msg || 'Failed to join the class'
			);
		}
	};

	// Map list of class groups
	return (
		<>
			<article className="invisible md:visible md:transition-transform md:duration-300 fixed flex-shrink-0 w-64 h-screen mt-14 lg:mt-24 py-4 px-1 border-r-2 bg-zinc-200 border-third shadow-md shadow-slate-300">
				{userRole === 'STUDENT' ? (
					<AddButton
						text="Join class"
						handleAdd={handleJoinButtonOpen}
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
						/>
					</div>
				)}

				<div className="m-2 border-t border-slate-400">
					<h2 className="pt-4 font-quizgate text-2xl tracking-wide">
						Class List
					</h2>
				</div>
				<div className="w-full h-fit grid grid-cols-1">
					{/* TEACHER & ADMIN use condition */}

					{userRole === 'TEACHER' || userRole === 'ADMIN'
						? Array.isArray(classData) &&
						  classData.map((classGroup) => (
								<div key={classGroup._id}>
									<MemoizedClassListCard
										key={classGroup._id}
										clickClassListCard={() =>
											handleClassLink(classGroup._id)
										}
										className={classGroup.className}
										subject={classGroup.subject}
									/>
								</div>
						  ))
						: // STUDENT as a class member condition
						userRole === 'STUDENT'
						? membershipData.map((membership) => (
								<div key={membership._id}>
									<MemoizedClassListCard
										key={membership._id}
										clickClassListCard={() =>
											handleClassLink(membership._id)
										}
										className={membership.className}
										subject={membership.subject}
									/>
								</div>
						  ))
						: null}
				</div>
			</article>
			{/* Delete quiz modal */}
			{isJoinModal && (
				<JoinClassModal
					isOpen={isJoinModal}
					onConfirm={handleJoinClass}
					onCancel={handleJoinButtonClose}
					heading="Join a class"
					message="Enter a join code to become a class group member. Class codes can be provide by the class administrator."
					accessCode={accessCode} // Pass the accessCode state
					setAccessCode={setAccessCode} // Pass the setAccessCode function
				/>
			)}
		</>
	);
};

export default ClassListMenu;
