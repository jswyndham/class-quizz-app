import AddClassForm from '../components/AddClassForm';

const AddClass = () => {
	return (
		<section className="flex justify-center align-middle w-screen h-screen bg-secondary mt-24 md:my-16 pt-4 md:pt-12 ">
			<article className="flex flex-col w-screen h-full overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Add Class
					</h1>
				</div>
				<AddClassForm />
			</article>
		</section>
	);
};

export default AddClass;
