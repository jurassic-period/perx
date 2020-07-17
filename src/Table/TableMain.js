import React, { useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHeader from "./TableHeader";
import TableBodyEl from "./TableBodyEl";
import { updateData } from '../redux/actions';
const axios = require("axios");

const VEHICLES_URL = "https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?";
const DEALERS_URL = "https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=";
const perPage = "per_page=10";

const mapStateToProps = (state) => ({ page: state.tableData.page });
// const mapDispatchToProps = () => {}

const pulledOffices = (acc, { id, address }) => ({ ...acc, [id]: address });

const preperedDealers = (acc, d) => {
  const { id, name, offices } = d;
  const obj = offices.reduce(pulledOffices, {});
  return { ...acc, [id]: { name, ...obj } };
};

const TableMain = ({ page, updateData }) => {
  const getCarsAndDellers = async () => {
    const url = `${VEHICLES_URL}page=${page}&${perPage}`;
    const vehiclesResponse = await axios.get(url, {
      headers: { "X-CS-Dealer-Id-Only": 1 },
    });
    const {
      data,
      headers: { "x-total-count": count },
    } = vehiclesResponse;
    console.log(data)
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
    console.log(dealersResponse)
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
    console.log(vehiclesData)
    updateData({
      data: vehiclesData,
      coll: dealersData,
    });
  };

  // getCarsAndDellers();

  useEffect(() => {getCarsAndDellers()}, []);

  return (
    <TableContainer>
      <Table>
        <TableHeader />
        <TableBodyEl />
      </Table>
    </TableContainer>
  );
};

export default connect(mapStateToProps, { updateData })(TableMain); 


 