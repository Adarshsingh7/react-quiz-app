/** @format */
import { useEffect, useReducer } from 'react';
import Header from './Header.jsx';
import Main from './Body.jsx';
import Loader from './Loader.jsx';
import Question from './Question.jsx';
import Error from './Error.jsx';
import '../index.css';
import axios from 'axios';
import StartScreen from './StartScreen.jsx';

const initialState = {
	questions: [],
	// [loading, error, ready, active, finished]
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
};

const reducer = function (state, action) {
	switch (action.type) {
		case 'dataReceived':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'start':
			return { ...state, status: 'start' };
		case 'newAnswer': {
			const question = state.questions[state.index];
			return {
				...state,
				answer: action.payload,
				points:
					question.correctOption === action.payload
						? state.points + question.pointsc
						: state.points,
			};
		}
		default:
			throw new Error('action is unknown');
	}
};

export default function App() {
	const [{ questions, answer, status, index, points }, dispatch] = useReducer(
		reducer,
		initialState
	);
	const numsQuestion = questions.length;
	useEffect(() => {
		const fetchData = async function () {
			try {
				const data = await axios.get('http://localhost:8080/questions');
				if (data.status === 200)
					dispatch({ type: 'dataReceived', payload: data.data });
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
				{status === 'start' && (
					<Question
						question={questions[index]}
						dispatch={dispatch}
						answer={answer}
					/>
				)}
			</Main>
		</div>
	);
}
