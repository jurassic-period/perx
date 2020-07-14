import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";

const HEADERS = ["VIN", "Brand", "Model", "Grade", "Diller", "Address"];

const useStyles = makeStyles({
  root: {
    background: "black",
    fontSize: "18px",
    color: "white",
  },
});

const TableHeader = () => {
  const classes = useStyles();
  return (
    <TableHead className={classes.root}>
      <TableRow>
        {HEADERS.map((name) => (
          <TableCell style={{ color: "white" }} key={name}>
            {name}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
