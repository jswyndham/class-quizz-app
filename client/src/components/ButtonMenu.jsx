const ButtonMenu = ({
	isShowButtonMenu,
	onClickMenuOne,
	onClickMenuTwo,
	iconOne,
	textOne,
	iconTwo,
	textTwo,
}) => {
	return (
		<div
			className={
				isShowButtonMenu
					? 'absolute visible right-1 lg:-right-1 w-56 h-fit p-1 font-roboto bg-white rounded-lg shadow-xl shadow-gray-500 drop-shadow-lg transition-all ease-in-out duration-100 top-7 lg:top-8  z-20'
					: 'absolute invisible'
			}
		>
			<ul className="text-lg">
				<li
					className="flex flex-row justify-start py-1 px-2 my-1 rounded-md hover:bg-gray-200 hover:w-full active:bg-gray-300 hover:cursor-pointer"
					onClick={onClickMenuOne}
				>
					<div className="mt-1 mr-4">{iconOne}</div>
					<p>{textOne}</p>
				</li>
				<li
					onClick={onClickMenuTwo}
					className="flex flex-row justify-start py-1 px-2 my-1 rounded-md hover:bg-gray-200 hover:w-full active:bg-gray-300 hover:cursor-pointer"
				>
					<div className="mt-1 mr-4">{iconTwo}</div>
					<p>{textTwo}</p>
				</li>
			</ul>
		</div>
	);
};

export default ButtonMenu;
