import React from 'react';
import { CiCirclePlus } from 'react-icons/ci';

const AddButton = ({ handleAdd, text }) => {
	return (
		<div className="relative flex flex-row justify-center items-center mx-3 my-5 lg:mt-6 lg:mb-4 h-14 w-fit">
			<div
				onClick={handleAdd}
				className="absolute left-8 top-4 flex text-center h-fit w-fit bg-green-600 text-primary rounded-r-full drop-shadow-xl shadow-md shadow-slate-400  hover:shadow-lg hover:shadow-slate-500 active:shadow-sm active:shadow-slate-600 hover:cursor-pointer"
			>
				<p className="w-max m-1 pl-11 pr-6 tracking-wider font-roboto font-bold text-xl border-t border-r border-b border-primary rounded-r-full">
					{text}
				</p>
				<CiCirclePlus className="absolute -left-3 -top-1 text-5xl text-primary bg-green-600 rounded-full" />
			</div>
		</div>
	);
};

export default AddButton;
