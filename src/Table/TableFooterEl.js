import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { connect } from "react-redux";
import {
  changePage,
  getNewData,
  changePerPage,
  getCount,
} from "../redux/actions";

const mapStateToProps = (state) => {
  const { count, page, perPage } = state.tableData;
  return {
    count,
    page,
    perPage,
  };
};

const TableFooterEl = ({
  count,
  page,
  perPage,
  changePage,
  getNewData,
  changePerPage,
  getCount,
}) => {
  const handleChangePage = (event, newPage) => {
    changePage({ page: newPage });
    getNewData();
  };

  const handleChangeRowsPerPage = ({ target: { value } }) => {
    changePerPage({ perPage: value });
    changePage({ page: 0 });
    const newCount = Math.round((count * perPage) / value);
    getCount({ count: newCount });
    getNewData();
  };

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          count={count}
          page={page}
          rowsPerPage={perPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  );
};

export default connect(mapStateToProps, {
  changePage,
  getNewData,
  changePerPage,
  getCount,
})(TableFooterEl);
