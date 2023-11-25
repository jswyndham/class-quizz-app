import { useClassCardContext } from './ClassCard';
import { Link } from 'react-router-dom';

const ClassCardMenu = ({ _id }) => {
	const { showClassCardMenu, toggleCardMenu } = useClassCardContext();

	return (
		<article className={showClassCardMenu ? 'flex' : 'hidden'}>
			<div
				className={
					'w-fit h-fit bg-white p-6 rounded-lg shadow-xl shadow-gray-800 drop-shadow-lg transition-all ease-in-out duration-300 top-0 z-50'
				}
			>
				<ul className="text-xl">
					<li className="m-2 hover:text-gray-500">
						<button onClick={toggleCardMenu}>duplicate</button>
					</li>
					<li className="m-2 hover:text-gray-500">
						<Link
							to={`/dashboard/edit-class/${_id}`}
							onClick={toggleCardMenu}
						>
							edit
						</Link>
					</li>
					<li className="m-2 hover:text-red-500 text-red-700">
						<button onClick={toggleCardMenu}>delete</button>
					</li>
				</ul>
			</div>
		</article>
	);
};

export default ClassCardMenu;
