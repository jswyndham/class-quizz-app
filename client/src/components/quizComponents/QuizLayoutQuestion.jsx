const QuizLayoutQuestion = ({
	questionNumber,
	points,
	question,
	uploadedImageUrl,
}) => {
	return (
		<section className="w-full h-fit bg-slate-200">
			<article className="flex flex-row justify-between align-middle pt-3 bg-forth text-white">
				<div className="pb-3 px-6 ">
					<p className="font-robotoCondensed font-bold text-2xl lg:text-3xl underline underline-offset-4">
						Question {questionNumber}.
					</p>
				</div>
				<div className="flex flex-row-reverse pb-3 pr-6">
					<p className="text-lg lg:text-xl font-roboto italic">
						{points} {points === 1 ? 'point' : 'points'}
					</p>
				</div>
			</article>
			<article className="flex flex-col m-2 pb-4 ">
				<div
					className="text-2xl lg:text-3xl p-2 lg:px-8 responsive-iframe"
					dangerouslySetInnerHTML={{ __html: question }}
				/>
				{uploadedImageUrl && (
					<div className="p-4">
						<img
							src={uploadedImageUrl}
							alt="Quiz"
							className="w-full h-auto"
						/>
					</div>
				)}
			</article>
		</section>
	);
};

export default QuizLayoutQuestion;
