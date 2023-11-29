// import { useNavigation } from "react-router-dom";
import AddClassForm from "../components/AddClassForm";

// access all fields using fromData() method and turn entries into an object

// export const action = async ({ request }) => {
// 	const formData = await request.formData();
// 	const data = Object.fromEntries(formData);

// 	try {
// 		await customFetch.post('/class', data);
// 		toast.success('Class created');
// 		return redirect('/dashboard');
// 	} catch (error) {
// 		console.log(error);
// 		toast.error(error?.response?.data?.msg);
// 		return error;
// 	}
// };

const AddClass = () => {
  // const navigation = useNavigation();
  // const isSubmitting = navigation.state === 'submitting';

  return (
    <section className="flex justify-center align-middle w-screen h-screen bg-secondary mt-24 md:my-16 pt-4 md:pt-12 ">
      <article className="flex flex-col w-screen h-full overflow-hidden">
        <div className="w-full bg-blue-400  text-center">
          <h1 className="m-6 text-3xl font-bold text-white">Add Class</h1>
        </div>
        <AddClassForm />
      </article>
    </section>
  );
};

export default AddClass;
