const CardModal = ({
	isShowClassMenu,
	handleDuplicate,
	handleEdit,
	isDelete,
	id,
}) => {
	return (
		<div
			className={
				isShowClassMenu
					? 'absolute visible w-fit h-fit bg-white p-6 rounded-lg shadow-xl shadow-gray-800 drop-shadow-lg transition-all ease-in-out duration-200 top-10 right-0 z-10'
					: 'absolute invisible'
			}
		>
			<ul className="text-xl">
				<li className="m-2 hover:text-gray-500">
					<button onClick={handleDuplicate}>Duplicate</button>
				</li>
				<li
					onClick={handleEdit}
					className="m-2 text-yellow-600 hover:text-yellow-400"
				>
					Edit
				</li>
				<li className="m-2 hover:text-red-500 text-red-700">
					<button onClick={() => isDelete(true)}>Delete</button>
				</li>
			</ul>
		</div>
	);
};

export default CardModal;
