import React from 'react';

const ClassDisplay = ({ id, name, subject, students, img }) => {
	return (
		<article className="h-56 w-80 flex flex-row bg-blue-300 rounded-lg drop-shadow-xl">
			<div>
				<h3>{name}</h3>
			</div>
			<div className="flex flex-col">
				<h4 className="m-2">{subject}</h4>
				<p className="m-2">Number of : {students}</p>
			</div>
		</article>
	);
};

export default ClassDisplay;
