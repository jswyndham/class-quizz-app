export const QuizPopUpModal = ({ isOpen, onConfirm, onCancel, message }) => {
	if (!isOpen) {
		console.log('isOpen is triggered');
		return null;
	} else {
		console.log('isOpen not triggered');
	}

	return (
		<article>
			<div className="fixed h-full w-full top-0 left-0 bg-gray-700 inset-0 opacity-70 z-40"></div>
			<div className="fixed inset-0 md:mx-20 flex items-center justify-center z-50">
				<div className="h-56 lg:max-w-3xl mx-2 lg:mx-0 rounded-lg drop-shadow-md shadow-md shadow-slate-400 border-solid border-2 border-third bg-white">
					<div className="modal">
						<div className="flex justify-center m-8">
							<p className="text-md md:text-xl font-sans text-center px-6">
								{message}
							</p>
						</div>
						<div className="flex justify-center md:mt-10">
							<button
								onClick={onConfirm}
								className="w-72 h-fit py-1 px-1 md:px-4 drop-shadow-lg border-2 border-green-500 text-lg font-semibold bg-white text-green-500 rounded-lg  hover:font-bold hover:shadow-md hover:shadow-slate-400 hover:bg-green-400 hover:text-white hover:border-slate-300 active:bg-slate-200 active:shadow-sm active:shadow-slate-500 active:text-green-600"
							>
								confirm
							</button>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};
