/** @format */

function Progress({ index, numQuestion, points, totalPoints, answer }) {
	return (
		<header className='progress'>
			<progress
				max={numQuestion}
				value={index + (answer !== null)}
			/>
			<p>
				Question <strong>{index + 1}</strong>/{numQuestion}
			</p>
			<p>
				<strong>{points}</strong> / {totalPoints}
			</p>
		</header>
	);
}

export default Progress;
