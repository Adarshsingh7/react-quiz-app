/** @format */

function Finished({ totalPoints, points, highscore, dispatch }) {
	console.log(highscore);
	const percentage = (points / totalPoints) * 100;
	return (
		<>
			<p className='result'>
				You scored <strong>{points}</strong> out of {totalPoints} (
				{Math.ceil(percentage)}% )
			</p>
			<p>(Highscore: {highscore} Points)</p>
			<button
				className='btn btn-ui'
				onClick={() => dispatch({ type: 'restart' })}
			>
				Restart
			</button>
		</>
	);
}

export default Finished;
