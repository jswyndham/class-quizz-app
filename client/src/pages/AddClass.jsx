import { FormRow, FormRowSelect } from '../components';
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
		<section className="flex justify-center align-middle w-screen h-screen mt-24 md:my-16  pt-4 md:pt-12 ">
			<article className="flex flex-col w-screen h-full overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Add Class
					</h1>
				</div>
				<div className="flex justify-center align-middle">
					<Form
						method="post"
						className="flex flex-col p-24 drop-shadow-lg 2xl:ml-20"
					>
						<div className="flex flex-col 2xl:flex-row mx-4 my-1">
							<div className="w-fit mx-4 my-2">
								<FormRow
									type="text"
									name="className"
									labelText="Class Title"
									placeholder="class title"
								/>
							</div>
							<div className="mx-4 my-2">
								<FormRowSelect
									labelText="Class Status"
									name="classStatus"
									defaultValue={CLASS_STATUS.CURRENT}
									list={Object.values(CLASS_STATUS)}
								/>
							</div>
						</div>
						<div className="flex flex-col 2xl:flex-row mx-4">
							<div className="mx-4 my-2">
								<FormRow
									type="text"
									name="subject"
									labelText="Subject"
									placeholder="subject"
								/>
							</div>

							<div className="mx-4 my-2">
								<FormRow
									type="text"
									name="school"
									labelText="School Name"
									placeholder="school name"
								/>
							</div>
							<button
								type="submit"
								className="h-8 w-full 2xl:w-60 mt-8 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
							>
								{isSubmitting ? 'submitting...' : 'create'}
							</button>
						</div>
					</Form>
				</div>
			</article>
		</section>
	);
};

export default AddClass;
