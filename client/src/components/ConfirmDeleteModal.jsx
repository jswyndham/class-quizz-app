const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, message }) => {
	if (!isOpen) {
		console.log('isOpen is triggered');
		return null;
	} else {
		console.log('isOpen not triggered');
	}

	return (
		<article>
			<div className="fixed h-full w-full top-0 left-0 bg-gray-700 inset-0 opacity-70 z-40"></div>
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="h-56 w-5/12 rounded-lg drop-shadow-md shadow-md shadow-slate-400 border-solid border-2 border-slate-300 bg-white">
					<div className="modal">
						<div className="flex m-10">
							<p className="text-xl font-serif text-center">
								{message}
							</p>
						</div>
						<div className="flex flex-row justify-around mt-20">
							<button
								onClick={onConfirm}
								className="w-full h-fit py-1 px-4 ml-8 mr-2 text-lg bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md hover:shadow-slate-400 active:bg-red-500 active:shadow-sm active:shadow-slate-500"
							>
								delete
							</button>
							<button
								onClick={onCancel}
								className="w-full h-fit py-1 px-4 mr-8 ml-2 border border-black text-lg bg-white text-black rounded-lg hover:bg-slate-200 hover:shadow-md hover:shadow-slate-400 active:bg-slate-200 active:shadow-sm active:shadow-slate-500"
							>
								cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default ConfirmDeleteModal;
