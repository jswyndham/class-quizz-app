const ButtonMenu = ({
	isShowButtonMenu,
	handleButtonOne,
	handleButtonTwo,
	textOne,
	textTwo,
}) => {
	return (
		<div
			className={
				isShowButtonMenu
					? 'absolute visible w-fit h-fit bg-white rounded-lg shadow-xl shadow-gray-500 drop-shadow-lg transition-all ease-in-out duration-100 top-7 right-1 lg:top-8 lg:right-3 z-20'
					: 'absolute invisible'
			}
		>
			<ul className="text-lg md:text-xl">
				<li
					className="flex flex-row w-full py-3 px-6 hover:bg-third hover:text-primary hover:rounded-t-md"
					onClick={handleButtonOne}
				>
					<p>{textOne}</p>
				</li>
				<li
					onClick={handleButtonTwo}
					className="flex flex-row w-full py-3 px-6 hover:bg-third hover:text-primary"
				>
					<p>{textTwo}</p>
				</li>
			</ul>
		</div>
	);
};

export default ButtonMenu;
