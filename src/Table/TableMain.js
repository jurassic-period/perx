import React, { useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHeader from "./TableHeader";
import TableBodyEl from "./TableBodyEl";
const axios = require("axios");

const VEHICLES_URL = "https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?";
const DEALERS_URL = "https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=";
const perPage = "per_page=10";

const mapStateToProps = (state) => ({ page: state.tableData.page });

const pulledOffices = (acc, { id, address }) => ({ ...acc, [id]: address });

const preperedDealers = (acc, d) => {
  const { id, name, offices } = d;
  const obj = offices.reduce(pulledOffices, {});
  return { ...acc, [id]: { name, ...obj } };
};

const TableMain = ({ page }) => {
  const getCarsAndDellers = async () => {
    const url = `${VEHICLES_URL}page=${page}&${perPage}`;
    const vehiclesResponse = await axios.get(url, {
      headers: { "X-CS-Dealer-Id-Only": 1 },
    });
    const {
      data,
      headers: { "x-total-count": count },
    } = vehiclesResponse;
    const sortedDillers = _.sortedUniq(
      data.reduce((acc, car) => {
        const { dealer } = car;
        if (dealer) return [...acc, dealer];
        return acc;
      }, [])
    );
    const dealersIdString = sortedDillers.join(",");
    const dealersResponse = await axios.get(`${DEALERS_URL}${dealersIdString}`);
    const dealersData = dealersResponse.data.reduce(preperedDealers, {});
    const vehiclesData = data.reduce((acc, v) => {
      const { vin, brand, model, grade, dealer, office_ids } = v;
      const [officeID] = office_ids;
      let name = null,
        address = null;
      if (dealer) {
        const dealerInfo = dealersData[dealer];
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
  };

  getCarsAndDellers();

  // useEffect();

  return (
    <TableContainer>
      <Table>
        <TableHeader />
        <TableBodyEl />
      </Table>
    </TableContainer>
  );
};

export default connect(mapStateToProps)(TableMain); 


 