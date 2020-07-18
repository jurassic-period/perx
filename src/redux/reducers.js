import { handleActions } from "redux-actions";
import { combineReducers } from "redux";
import { updateData, getCount, changePage, changePerPage } from "./actions.js";

const defaultState = { page: 0, data: [], showTable: false, perPage: 10 };
const tableData = handleActions(
  {
    [updateData]: (state, { payload: { data } }) => {
      return { ...state, data, showTable: true };
    },
    [getCount]: (state, { payload: { count } }) => {
      return { ...state, count };
    },
    [changePage]: (state, { payload: { page } }) => {
      return { ...state, page, showTable: false };
    },
    [changePerPage]: (state, { payload: { perPage } }) => {
      return { ...state, perPage, showTable: false };
    },
  },
  defaultState
);

const dealers = handleActions(
  {
    [updateData]: (state, { payload: { coll } }) => {
      if (coll) return { coll };
      return state;
    },
  },
  {} //defaultState
);

export default combineReducers({
  tableData,
  dealers,
});
