import { FormRow } from '../components';
import { useOutletContext } from 'react-router';
import { CLASS_STATUS } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

const AddClass = () => {
	// const { user } = useOutletContext();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';

	return (
		<section className="w-screen h-screen mx-2 my-24 md:my-16 lg:mx-24 flex justify-center align-middle p-12 md:p-24">
			<article className="flex flex-col w-full h-5/6 md:w-5/6 md:h-1/2 py-16 border-solid border-2 border-sky-200 rounded-xl shadow-xl">
				<div className="w-full bg-blue-400 -mt-16 text-center rounded-t-xl">
					<h1 className="m-6 text-3xl font-bold text-white">
						Add Class
					</h1>
				</div>
				<div className="flex justify-center align-middle">
					<Form
						method="post"
						className="flex flex-col p-24 drop-shadow-lg"
					>
						<div className="w-fit m-4">
							<FormRow
								type="text"
								name="className"
								labelText="Class Title"
								placeholder="class title"
							/>
						</div>
						<div className="flex flex-col xl:flex-row m-4">
							<div className="xl:mr-2">
								<FormRow
									type="text"
									name="subject"
									labelText="Subject"
									placeholder="subject"
								/>
							</div>

							<div className="xl:ml-2">
								<FormRow
									type="text"
									name="school"
									labelText="School Name"
									placeholder="school name"
								/>
							</div>
						</div>

						<button className="h-8 w-60 mt-6 mx-4 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl">
							{isSubmitting ? 'submitting...' : 'create'}
						</button>
					</Form>
				</div>
			</article>
		</section>
	);
};

export default AddClass;
