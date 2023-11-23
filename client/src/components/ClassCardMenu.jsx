import React from 'react';
import { useClassCardContext } from './ClassCard';

const ClassCardMenu = () => {
	const { showClassCardMenu } = useClassCardContext();
	return (
		<section className={showClassCardMenu ? 'flex' : 'hidden'}>
			<div
				className={
					'w-fit h-fit bg-white p-4 rounded-lg shadow-xl shadow-gray-800 drop-shadow-lg transition-all ease-in-out duration-300 top-0 z-50'
				}
			>
				<ul>
					<li>duplicate</li>
					<li>edit</li>
					<li>delete</li>
				</ul>
			</div>
		</section>
	);
};

export default ClassCardMenu;
