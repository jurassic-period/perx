import React, { useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHeader from "./TableHeader";
import TableBodyEl from "./TableBodyEl";
import TableFooterEl from "./TableFooterEl";
import { updateData, getCount } from "../redux/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import { VEHICLES_URL, DEALERS_URL, preperedDealers } from "../CONSTANTS";
const axios = require("axios");

const mapStateToProps = (state) => {
  const { page, data, showTable, perPage } = state.tableData;
  return {
    page,
    data,
    showTable,
    perPage,
  };
};

const TableMain = ({
  page,
  perPage,
  updateData,
  getCount,
  data,
  showTable,
}) => {
  const getCarsAndDellers = async () => {
    const url = `${VEHICLES_URL}page=${page}&per_page=${perPage}`;
    const vehiclesResponse = await axios.get(url, {
      headers: { "X-CS-Dealer-Id-Only": 1 },
    });
    const {
      data,
      headers: { "x-total-count": count },
    } = vehiclesResponse;
    const uniqDealers = _.uniqBy(
      data.reduce((acc, car) => {
        const { dealer } = car;
        if (dealer) return [...acc, dealer];
        return acc;
      }, [])
    );
    const dealersIdString = uniqDealers.join(",");
    const dealersResponse = await axios.get(`${DEALERS_URL}${dealersIdString}`);
    const dealersData = dealersResponse.data.reduce(preperedDealers, {});
    const vehiclesData = data.reduce((acc, v) => {
      const { vin, brand, model, grade, dealer: dealerKey, office_ids } = v;
      const [officeID] = office_ids;
      let name = null,
        address = null;
      if (dealerKey) {
        const dealerInfo = dealersData[dealerKey];
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
    getCount({
      count: Math.round(count / perPage),
    });
    updateData({
      data: vehiclesData,
      coll: dealersData,
    });
  };

  useEffect(() => {
    getCarsAndDellers();
  }, []);

  if (!showTable) return <LinearProgress />;
  return (
    <TableContainer>
      <Table>
        <TableHeader />
        {data.map((car) => (
          <TableBodyEl key={_.uniqueId("body_")} car={car} />
        ))}
        <TableFooterEl />
      </Table>
    </TableContainer>
  );
};

export default connect(mapStateToProps, { updateData, getCount })(TableMain);
