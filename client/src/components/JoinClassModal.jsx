import { useState } from 'react';

const JoinClassModal = ({ isOpen, onConfirm, onCancel, heading, message }) => {
	const [inputValue, setInputValue] = useState('');

	if (!isOpen) {
		console.log('isOpen is triggered');
		return null;
	} else {
		console.log('isOpen not triggered');
	}

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const isJoinDisabled = !inputValue;

	return (
		<article>
			<div className="fixed h-full w-full top-0 left-0 bg-gray-700 inset-0 opacity-70 z-40"></div>
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="flex h-fit w-fit mx-2 lg:mx-0 rounded-lg drop-shadow-md shadow-md shadow-slate-400 border-solid border-2 border-third bg-white">
					<div className="flex flex-col modal w-96">
						<div className="w-8/12 font-roboto flex flex-col justify-start mt-8 mb-6 ml-10">
							<p className="text-xl md:text-2xl font-bold mb-3">
								{heading}
							</p>
							<p className="text-lg md:text-xl">{message}</p>
						</div>
						<div className="ml-10 my-3">
							<input
								type="text"
								className="bg-slate-100 rounded-md p-2 border border-slate-400"
								value={inputValue}
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-row justify-start my-7 mx-4">
							<button
								onClick={onConfirm}
								className={`w-40 h-fit py-1 px-1 md:px-4 ml-6 mr-4 text-lg rounded-lg ${
									isJoinDisabled
										? 'bg-gray-400 text-gray-700 cursor-not-allowed'
										: 'border border-third bg-third text-white hover:shadow-md hover:shadow-slate-400 hover:text-primary active:bg-white active:shadow-sm active:shadow-slate-500 active:text-third'
								}`}
								disabled={isJoinDisabled}
							>
								join
							</button>
							<button
								onClick={onCancel}
								className="w-40 h-fit py-1 px-1 md:px-4 mr-6 ml-4 border border-black text-lg bg-white text-red-600 rounded-lg hover:shadow-md hover:shadow-slate-400 active:border-white active:bg-red-600 active:text-white active:shadow-sm active:shadow-slate-500"
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

export default JoinClassModal;
