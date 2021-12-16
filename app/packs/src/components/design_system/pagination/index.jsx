import React from "react";
import ArrowBack from "src/components/icons/ArrowBack";
import ArrowForward from "src/components/icons/ArrowForward";
import cx from "classnames";

import { string, func, oneOf } from "prop-types";

const Pagination = ({ onChangePage, mode, currentPage, maxPages }) => {
  return (
    <>
      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <button
              className={`page-link pagination-button ${mode}`}
              onClick={onChangePage}
            >
              <ArrowBack pathClassName={cx("icon-theme", mode)} />
            </button>
          </li>

          {[...Array(maxPages)].map((x, i) => (
            <li class="page-item">
              <button
                className={cx(
                  "page-link pagination-button",
                  currentPage === i + 1 ? "active" : "",
                  mode
                )}
                onClick={onChangePage}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li class="page-item">
            <button
              className={`page-link pagination-button ${mode}`}
              onClick={onChangePage}
            >
              <ArrowForward pathClassName={cx("icon-theme", mode)} />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

Pagination.defaultProps = {
  mode: "light",
  currentPage: 1,
  maxPages: 5,
};

Pagination.propTypes = {
  mode: oneOf(["light", "dark"]),
};

export default Pagination;
