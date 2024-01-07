const QuizLayoutQuestion = ({
	questionNumber,
	points,
	question,
	uploadedImageUrl,
}) => {
	return (
		<div className="w-full h-fit bg-blue-100">
			<div className="mb-2 mx-4 pt-1">
				<p className="underline underline-offset-2">
					Question {questionNumber}
				</p>
			</div>
			<div className="flex flex-row-reverse  pt-3 pr-6">
				<p className="text-lg italic">
					{points} {points === 1 ? 'point' : 'points'}
				</p>
			</div>
			<div className="flex flex-col m-2">
				<div
					className="text-3xl pb-4 px-2 lg:px-8 responsive-iframe"
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
			</div>
		</div>
	);
};

export default QuizLayoutQuestion;
