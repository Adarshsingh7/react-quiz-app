/** @format */

import { useReducer } from 'react';

const initialState = {
	count: 0,
	step: 1,
};

function reducer(state, action) {
	switch (action.type) {
		case 'inc':
			return { ...state, count: state.count + state.step };
		case 'dec':
			return { ...state, count: state.count + state.step };
		case 'set':
			return { ...state, count: action.payload };
		case 'reset':
			return initialState;
		case 'step':
			return { ...state, step: action.payload };
	}
}

function DateCounter() {
	const [{ count, step }, dispatch] = useReducer(reducer, initialState);

	const date = new Date('june 21 2027');
	date.setDate(date.getDate() + count);

	const dec = function () {
		dispatch({ type: 'dec', payload: -1 });
	};

	const inc = function () {
		dispatch({ type: 'inc', payload: 1 });
	};

	const defineCount = function (e) {
		dispatch({ type: 'set', payload: Number(e.target.value) });
	};

	const defineStep = function (e) {
		dispatch({ type: 'step', payload: Number(e.target.value) });
	};

	const reset = function () {
		dispatch({ type: 'reset', payload: '' });
	};

	return (
		<div className='counter'>
			<div>
				<input
					type='range'
					min='0'
					max='10'
					value={step}
					onChange={defineStep}
				/>
				{/* <span>{step}</span> */}
			</div>

			<div>
				<button onClick={dec}>-</button>
				<input
					value={count}
					onChange={defineCount}
				/>
				<button onClick={inc}>+</button>
			</div>

			<p>{date.toDateString()}</p>

			<div>
				<button onClick={reset}>Reset</button>
			</div>
		</div>
	);
}
export default DateCounter;
