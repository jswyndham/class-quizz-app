const ClassInfo = ({ icon, text }) => {
	return (
		<article className="flex flex-row my-2 text-xl">
			<span className="mx-3 mt-1">{icon}</span>
			<span className="job-text">{text}</span>
		</article>
	);
};

export default ClassInfo;
