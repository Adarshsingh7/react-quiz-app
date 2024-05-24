/** @format */
import { useEffect, useReducer } from 'react';
import axios from 'axios';

import Header from './Header.jsx';
import Main from './Body.jsx';
import Loader from './Loader.jsx';
import Question from './Question.jsx';
import Error from './Error.jsx';
import StartScreen from './StartScreen.jsx';
import NextButton from './NextButton.jsx';
import Progress from './Progress.jsx';
import Finished from './Finished.jsx';
import Footer from './Footer.jsx';
import Timer from './Timer.jsx';

import '../index.css';

const SECS_PER_QUES = 30;

const initialState = {
	questions: [],
	// [loading, error, ready, active, finished]
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	higscore: 0,
	secondsRemaining: 0,
};

const reducer = function (state, action) {
	switch (action.type) {
		case 'dataReceived':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'start':
			return {
				...state,
				status: 'active',
				secondsRemaining: state.questions.length * SECS_PER_QUES,
			};
		case 'newAnswer': {
			const question = state.questions[state.index];
			return {
				...state,
				answer: action.payload,
				points:
					question.correctOption === action.payload
						? state.points + question.points
						: state.points,
			};
		}
		case 'nextQuestion': {
			return { ...state, index: state.index + 1, answer: null };
		}
		case 'finish':
			return {
				...state,
				status: 'finished',
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};
		case 'restart':
			return { ...initialState, status: 'ready', questions: state.questions };
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? 'finished' : state.status,
			};
		default:
			throw new Error('action is unknown');
	}
};

export default function App() {
	const [
		{ questions, answer, status, index, points, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);
	const numsQuestion = questions.length;
	const totalPoints = questions.reduce((prev, curr) => prev + curr.points, 0);
	useEffect(() => {
		const fetchData = async function () {
			try {
				const data = await axios.get('http://localhost:8000/questions');
				if (data.status === 200)
					dispatch({ type: 'dataReceived', payload: data.data });
				else dispatch({ type: 'error' });
			} catch (error) {
				dispatch({ type: 'dataFailed' });
			}
		};
		fetchData();
	}, []);

	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && (
					<StartScreen
						numsQuestion={numsQuestion}
						dispatch={dispatch}
					/>
				)}
				{status === 'active' && (
					<>
						<Progress
							index={index}
							numQuestion={numsQuestion}
							points={points}
							totalPoints={totalPoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer
								secondsRemaining={secondsRemaining}
								dispatch={dispatch}
							/>
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestion={numsQuestion}
							/>
						</Footer>
					</>
				)}
				{status === 'finished' && (
					<Finished
						totalPoints={totalPoints}
						points={points}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}
