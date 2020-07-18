import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import _ from "lodash";

const TableBodyEl = ({ car }) => {
  const keys = Object.keys(car);
  return (
    <TableBody>
      <TableRow>
        {keys.map((k) => (
          <TableCell key={_.uniqueId("key_")}>{car[k]}</TableCell>
        ))}
      </TableRow>
    </TableBody>
  );
};

export default TableBodyEl;
