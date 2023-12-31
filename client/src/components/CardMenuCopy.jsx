import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../features/classGroup/classAPI';

const CardMenuCopy = ({ classCopyKey, classCopy }) => {
	const classList = useSelector((state) => state.class);

	useEffect(() => {
		useDispatch(fetchClasses());
	}, []);

	return (
		<div
			className={
				isShowClassMenu
					? 'absolute visible w-fit h-fit bg-white p-6 rounded-lg shadow-xl shadow-gray-500 drop-shadow-lg transition-all ease-in-out duration-200 top-10 right-0 z-50'
					: 'absolute invisible'
			}
		>
			<ul className="text-xl">
				{classList.map((classes) => (
					<li
						key={classCopyKey}
						onClick={classCopy}
						className="m-2 hover:text-gray-500"
					>
						{classList.className}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CardMenuCopy;
