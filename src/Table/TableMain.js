import React, { useEffect } from "react";
import { connect } from "react-redux";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHeader from "./TableHeader";
import TableBodyEl from "./TableBodyEl";
const axios = require('axios');

const URL = 'https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?';
const perPage = 'per_page=10';

const mapStateToProps = (state) => ({page: state.tableData.page});

const TableMain = ({ page }) => {
  
    const getCarsAndDillers = async () => {
        const url = `${URL}page=${page}&${perPage}`;
        const carsColl = await axios.get(url, {headers: { 'X-CS-Dealer-Id-Only': 1 }});
        console.log(carsColl)
    };

    getCarsAndDillers()

  
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


 