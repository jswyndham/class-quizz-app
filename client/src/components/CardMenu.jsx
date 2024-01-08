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
				<li className="w-full py-3 px-5 hover:bg-third hover:text-primary hover:rounded-t-md">
					<button onClick={handleCopy}>Copy</button>
				</li>
				<li
					onClick={handleEdit}
					className="text-yellow-600 w-full py-3 px-5 hover:bg-third hover:text-primary"
				>
					Edit
				</li>
				<li className="text-red-700 w-full py-3 px-5 hover:bg-third hover:text-primary hover:rounded-b-md">
					<button onClick={() => handleDelete(true)}>Delete</button>
				</li>
			</ul>
		</div>
	);
};

export default CardMenu;
