import classes from "./TableFooter.module.css";

const TableFooter = ({ page, max, filteredLength, totalLength, children }) => {
  const startPage = filteredLength === 0 ? 0 : (page - 1) * max + 1;
  const endPage = page * max <= filteredLength ? page * max : filteredLength;

  const resultsMessage = (
    <span>
      Showing {startPage} to {endPage} of {filteredLength}
    </span>
  );

  const filteredMessage = filteredLength !== totalLength && (
    <span> (filtered from {totalLength} total entries)</span>
  );

  return (
    <div className={classes.tableFooter}>
      <div className={classes.tableResults}>
        {resultsMessage}
        {filteredMessage}
      </div>
      {children}
    </div>
  );
};

export default TableFooter;
