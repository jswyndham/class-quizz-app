import { FormRow, FormRowSelect } from '../components';
import { useLoaderData } from 'react-router-dom';
import { CLASS_STATUS } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async ({ params }) => {
	try {
		const { data } = await customFetch.get(`/class/${params.id}`);
		return data;
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return redirect('/dashboard');
	}
};
export const action = async () => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	try {
		await customFetch.patch(`/class/${params.id}`, data);
		toast.success('Class updated');
		return redirect('/dashboard');
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const EditClass = () => {
	const { classGroup } = useLoaderData();
	console.log(classGroup);

	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';

	return (
		<article className="flex justify-center align-middle w-screen h-full overflow-hidden">
			<Form
				method="post"
				className="m-24 flex flex-col p-24 drop-shadow-lg"
			>
				<div className="flex flex-col justify-center">
					<div className="m-6 text-center">
						<h2 className="text-4xl text-blue-600 font-bold">
							Edit Class
						</h2>
					</div>
					<div className="flex flex-col 2xl:flex-row mx-4 my-1">
						<div className="w-fit mx-4 my-2">
							<FormRow
								type="text"
								name="className"
								labelText="Class Title"
								defaultValue={classGroup.className}
							/>
						</div>
						<div className="mx-4 my-2">
							<FormRowSelect
								labelText="Class Status"
								name="classStatus"
								defaultValue={classGroup.classStatus}
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
								defaultValue={classGroup.subject}
							/>
						</div>

						<div className="mx-4 my-2">
							<FormRow
								type="text"
								name="school"
								labelText="School Name"
								defaultValue={classGroup.school}
							/>
						</div>
					</div>
					<button
						type="submit"
						className="h-8 w-10/12 2xl:w-60 mt-8 mx-9 bg-blue-400 text-white rounded-lg drop-shadow-lg hover:bg-blue-600 hover:text-gray-100 hover:shadow-xl"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'submitting...' : 'update'}
					</button>
				</div>
			</Form>
		</article>
	);
};

export default EditClass;
