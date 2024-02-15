/**
 * CardMenu Component
 *
 * Purpose:
 * This component is used to display a dropdown menu with options like copy, edit, and delete.
 * It is designed to be reusable and configurable to fit various use cases where a contextual menu is needed.
 *
 * Props:
 * - menuConfig: An object that specifies which menu items should be visible.
 * - listNameOne, listNameTwo, listNameThree: Strings to display as menu item names.
 * - isShowClassMenu: Boolean to control the visibility of the entire menu.
 * - handleCopy, handleEdit, handleDelete: Callback functions to handle menu item actions.
 *
 * Usage:
 * menuConfig should be an object with boolean values for 'copy', 'edit', and 'delete' keys.
 * These determine whether the corresponding menu item is shown or hidden.
 *
 * Example:
 * <CardMenu
 *   menuConfig={{ copy: true, edit: false, delete: true }}
 *   listNameOne="Copy"
 *   listNameTwo="Edit"
 *   listNameThree="Delete"
 *   isShowClassMenu={true}
 *   handleCopy={copyHandler}
 *   handleEdit={editHandler}
 *   handleDelete={deleteHandler}
 * />
 */

import { FaCopy } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CardMenu = ({
	menuConfig,
	listNameOne,
	listNameTwo,
	listNameThree,
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
			<ul className="text-lg md:text-xl">
				{menuConfig.copy && (
					<li
						className="flex flex-row w-full py-3 px-6 hover:bg-third hover:text-primary hover:rounded-t-md"
						onClick={handleCopy}
					>
						<FaCopy className="mt-1 mr-6" />
						{listNameOne}
					</li>
				)}
				{menuConfig.edit && (
					<li
						onClick={handleEdit}
						className="flex flex-row w-full py-3 px-6 hover:bg-third hover:text-primary"
					>
						<FaEdit className="mt-1 mr-6" />
						{listNameTwo}
					</li>
				)}
				{menuConfig.delete && (
					<li
						className="flex flex-row w-full py-3 px-6 hover:bg-third hover:text-primary hover:rounded-b-md"
						onClick={() => handleDelete(true)}
					>
						<MdDelete className="mt-1 mr-6" />
						{listNameThree}
					</li>
				)}
			</ul>
		</div>
	);
};

export default CardMenu;
