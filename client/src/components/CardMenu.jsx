import { FaCopy } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CardMenu = ({
	isShowClassMenu,
	handleCopy,
	handleEdit,
	handleDelete,
}) => {
	return (
		<div
			className={
				isShowClassMenu
					? 'absolute visible w-fit h-fit bg-white rounded-lg shadow-xl shadow-gray-500 drop-shadow-lg transition-all ease-in-out duration-100 top-7 right-1 lg:top-8 lg:right-3 z-20'
					: 'absolute invisible'
			}
		>
			<ul className="text-lg md:text-xl ">
				<li
					className="flex flex-row w-full py-3 px-5 hover:bg-third hover:text-primary hover:rounded-t-md"
					onClick={handleCopy}
				>
					<FaCopy className="mt-1 mr-6" />
					<p>Copy</p>
				</li>
				<li
					onClick={handleEdit}
					className="flex flex-row w-full py-3 px-5 hover:bg-third hover:text-primary"
				>
					<FaEdit className="mt-1 mr-6" />
					<p>Edit</p>
				</li>
				<li
					className="flex flex-row w-full py-3 px-5 hover:bg-third hover:text-primary hover:rounded-b-md"
					onClick={() => handleDelete(true)}
				>
					<MdDelete className="mt-1 mr-6" />
					<p>Delete</p>
				</li>
			</ul>
		</div>
	);
};

export default CardMenu;
