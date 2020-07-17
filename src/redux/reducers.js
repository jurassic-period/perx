// export const reducer = (state = { page: 0 }, action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };

// export const dilerReducer = (state = {}, action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };

import { handleActions } from 'redux-actions';
import { combineReducers } from "redux";
import { updateData } from './actions.js';

const defaultState = { page: 0 };
const tableData = handleActions(
  {
    [updateData]: (state, { payload: { data } }) => {
      const { page } = state;
      return { page, data };
    },
  },
  defaultState
);

const dealers = handleActions(
  {
    [updateData]: (state, { payload: { coll } }) => {
      return { coll };
    },
  },
  {} //defaultState
);

export default combineReducers({
  tableData,
  dealers,
});
