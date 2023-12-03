const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, message }) => {
	if (!isOpen) {
		console.log('isOpen is triggered');
		return null;
	} else {
		console.log('isOpen not triggered');
	}

	return (
		<article>
			<div className="absolute h-screen w-screen bg-gray-700 bg-blend-overlay inset-0 opacity-70"></div>
			<div className="flex justify-center">
				<div className="h-56 w-96 rounded-lg drop-shadow-md shadow-md shadow-slate-400 border-solid border-2 border-slate-300 bg-white">
					<div className="modal">
						<div className="flex m-6">
							<p className="text-2xl font-serif">{message}</p>
						</div>
						<div className="flex flex-row justify-around mt-16">
							<button
								onClick={onConfirm}
								className="w-fit h-fit py-1 px-4 text-lg bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 hover:shadow-md hover:shadow-slate-400 active:bg-green-600 active:shadow-sm active:shadow-slate-500"
							>
								delete
							</button>
							<button
								onClick={onCancel}
								className="w-fit h-fit py-1 px-4 text-lg bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-md hover:shadow-slate-400 active:bg-red-600 active:shadow-sm active:shadow-slate-500"
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
