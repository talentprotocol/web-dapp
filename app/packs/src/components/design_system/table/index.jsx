import React from "react";
import { node, string } from "prop-types";
import cx from "classnames";

const Table = ({ children, mode, className }) => (
  <table className={cx("talent-table", mode, className)}>{children}</table>
);

const Head = ({ children }) => (
  <thead>
    <tr>{children}</tr>
  </thead>
);

const Body = ({ children }) => <tbody>{children}</tbody>;

const Tr = ({ children, onClick }) => <tr onClick={onClick}>{children}</tr>;

const Cell = ({ children, header, className }) => {
  return header ? (
    <th className={className}>{children}</th>
  ) : (
    <td className={className}>{children}</td>
  );
};

Table.defaultProps = {
  mode: "light",
};

Table.propTypes = {
  children: node.isRequired,
  mode: string,
};

const Th = (props) => <Cell {...props} header />;
const Td = (props) => <Cell {...props} />;

Table.Head = Head;
Table.Body = Body;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;

export default Table;
