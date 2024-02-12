// Accessing props from the parent component, ClassListMenu
const ClassListCard = ({ clickClassListCard, className, subject }) => {
	// function to truncate string (cut short with periods)
	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.substring(0, maxLength - 3) + '...';
		}
		return str;
	}

	// Class name with trunate function
	const classNameOriginal = `${className}`;
	const classNameTrunicate = truncateString(classNameOriginal, 30);

	// Class subject - turn string to capitals
	const subjectOriginal = `${subject}`;
	const subjectToCapital = subjectOriginal.toUpperCase();

	return (
		<>
			{/* Class List Menu */}
			<article
				onClick={clickClassListCard}
				className="relative w-full h-fit my-1 border border-forth shadow-sm shadow-gray-400 rounded-sm hover:cursor-pointer hover:bg-white"
			>
				<div className="flex flex-col h-fit p-2">
					<h3 className="text-md text-forth font-bold">
						{classNameTrunicate}
					</h3>
					<p className="text-xs text-third italic font-sans ml-1">
						{subjectToCapital}
					</p>
				</div>
			</article>
		</>
	);
};

export default ClassListCard;
