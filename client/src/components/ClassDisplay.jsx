import React from 'react';

const ClassDisplay = ({ id, name, subject, students, img }) => {
	return (
		<article className="h-36 w-96 m-7 flex flex-row justify-center align-middle bg-blue-300 rounded-lg drop-shadow-xl">
			<div className="left-0 m-4">
				<h3 className="flex">{name}</h3>
			</div>
			<div className="flex flex-col align-bottom">
				<h4 className="m-2">{subject}</h4>
				<p className="m-2">No. of students: {students}</p>
			</div>
		</article>
	);
};

export default ClassDisplay;
