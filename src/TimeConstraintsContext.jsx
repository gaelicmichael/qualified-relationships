import React, { useReducer, createContext } from "react";

const initialState = {
  start: 1200,
  end: 1700,
  step: 10,
  initial: 1300,
  active: false,
  current: 1300,
};

export const TimeContext = createContext();

const reducer = (state, action) => {
  switch(action.type) {
  case 'SET_ACTIVE':
    return { ...state, active: action.payload };
  case 'SET_CURRENT':
    return { ...state, current: action.payload };
  default:
    throw new Error();
  }
}

export const TimeContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TimeContext.Provider value={[state, dispatch]}>
      {props.children}
    </TimeContext.Provider>
  );
};
