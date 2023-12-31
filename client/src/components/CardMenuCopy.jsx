import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../features/classGroup/classAPI';
import { useEffect } from 'react';
import { TiDelete } from 'react-icons/ti';

const CardMenuCopy = ({ quizOnClick, isShowClassList, classListClose }) => {
	const classList = useSelector((state) => state.class.class);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchClasses());
	}, [dispatch]);

	return (
		<div
			className={
				isShowClassList
					? 'absolute visible w-fit h-fit bg-white rounded-lg shadow-xl shadow-gray-500 drop-shadow-lg transition-all ease-in-out duration-300 top-10 right-0 z-50'
					: 'absolute invisible'
			}
		>
			<div className="flex justify-between bg-forth w-full text-end px-6 py-2">
				<div className="absolute w-3 h-3 bg-primary top-5 left-4"></div>
				<div
					onClick={classListClose}
					className="relative mt-1 -ml-4 text-3xl text-red-600 hover:cursor-pointer hover:text-red-700"
				>
					<TiDelete />
				</div>
				<h4 className="text-lg md:text-xl mr-3 mt-1 text-primary">
					Copy
				</h4>
			</div>
			<div className="ml-3 mt-2 italic text-red-800">
				<p>Choose your class</p>
			</div>
			<ul className="text-lg md:text-xl p-2">
				{classList.map((classItem) => (
					<li
						key={classItem._id}
						onClick={(e) => quizOnClick(e, classItem._id)}
						className="m-2 hover:text-gray-500"
					>
						{classItem.className}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CardMenuCopy;
