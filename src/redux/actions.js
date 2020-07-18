import { createAction } from "redux-actions";
import { VEHICLES_URL, DEALERS_URL, preperedDealers } from "../CONSTANTS";
import _ from "lodash";
const axios = require("axios");

export const updateData = createAction("UPDATE_COLL_CARS_AND_DILLERS");
export const getCount = createAction("GET_COUNT");
export const changePage = createAction("CHANGE_PAGE");
export const changePerPage = createAction("CHANGE_PER_PAGE");

export const getNewData = () => {
  return async (dispatch, getState) => {
    const {
      tableData: { page, perPage },
      dealers: { coll: memoDealersData },
    } = getState();

    const url = `${VEHICLES_URL}page=${page}&per_page=${perPage}`;
    const vehiclesResponse = await axios.get(url, {
      headers: { "X-CS-Dealer-Id-Only": 1 },
    });
    const { data } = vehiclesResponse;
    const uniqDealers = _.uniqBy(
      data.reduce((acc, car) => {
        const { dealer } = car;
        if (dealer) return [...acc, dealer];
        return acc;
      }, [])
    );
    let currendDealersData = { ...memoDealersData };
    const newDealers = uniqDealers.filter((d) => {
      if (d in memoDealersData) return false;
      return true;
    });
    if (newDealers.length) {
      const dealersIdString = newDealers.join(",");
      const dealersResponse = await axios.get(
        `${DEALERS_URL}${dealersIdString}`
      );
      const dealersData = dealersResponse.data.reduce(preperedDealers, {});
      currendDealersData = { ...memoDealersData, ...dealersData };
    }
    const vehiclesData = data.reduce((acc, v) => {
      const {
        vin,
        brand,
        model,
        grade,
        dealer: dealerKey,
        office_ids = [null],
      } = v;
      const [officeID] = office_ids;
      let name = null,
        address = null;
      if (dealerKey) {
        const dealerInfo = currendDealersData[dealerKey];
        name = dealerInfo.name;
        address = dealerInfo[officeID];
      }
      return [
        ...acc,
        {
          vin,
          brand,
          model,
          grade,
          name,
          address,
        },
      ];
    }, []);
    const coll = newDealers.length ? currendDealersData : null;
    dispatch(updateData({ data: vehiclesData, coll }));
  };
};