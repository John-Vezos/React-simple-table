import classes from "./Table.module.css";
import { Fragment, useLayoutEffect, useMemo, useState } from "react";
import Pager from "./pager/Pager";
import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";

const DEFAULT_MAX = 10;
const NO_RESULTS_MESSAGE = "No matching records found";
const Table = ({
  data,
  functions,
  maxEntitiesList,
  responsive,
  striped,
  bordered,
}) => {
  const [filteredData, setFilteredData] = useState({ ...data });
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(
    Math.ceil(data.rows.length / (maxEntitiesList?.[0] || DEFAULT_MAX))
  );
  const [sortBy, setSortBy] = useState({ name: "", order: 1 });
  const [maxEntities, setMaxEntities] = useState(
    maxEntitiesList?.[0] || DEFAULT_MAX
  );
  const [searchInput, setSearchInput] = useState("");

  const labels = useMemo(
    () => data.columns.map((item) => item.field),
    [data.columns]
  );
  const maxWidth = useMemo(
    () =>
      data.columns.reduce(
        (previousValue, currentValue) => previousValue + currentValue.width,
        0
      ),
    [data.columns]
  );

  let combineClasses = classes.table;
  if (striped) combineClasses += " " + classes.tStripped;
  if (bordered) combineClasses += " " + classes.tBorder;

  useLayoutEffect(() => {
    const newData = { ...data };

    newData.rows = searchTokens(data.rows);

    const currMaxPages = Math.ceil(newData.rows.length / maxEntities);
    setMaxPages(currMaxPages);

    if (sortBy.name) {
      if (sortBy.order === 1)
        newData.rows = newData.rows.sort(sortList.bind(null, sortBy.name));
      else
        newData.rows = newData.rows
          .sort(sortList.bind(null, sortBy.name))
          .reverse();
    }

    setFilteredData(newData);
    setPage(1);
  }, [data, searchInput, sortBy, maxEntities]);

  const sortList = (name, list, listB) => {
    return list[name].localeCompare(listB[name], undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const searchTokens = (dataRows) => {
    let currDataRows = dataRows;
    const searchTokens = searchInput.split(" ")
      ? searchInput.split(" ")
      : [searchInput];

    let i = 0;
    do {
      const loopParameter = searchTokens[i];
      currDataRows = currDataRows.filter((item) =>
        labels
          .map((label) => compareStringsInsensitive(item[label], loopParameter))
          .includes(true)
      );
      i++;
    } while (i < searchTokens.length);

    return currDataRows;
  };

  const compareStringsInsensitive = (string1, string2) =>
    string1
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .includes(
        string2
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
      );

  const searchHandler = (event) => setSearchInput(event.target.value);
  const sortHandler = (value) => {
    if (value !== sortBy.name) setSortBy({ name: value, order: 1 });
    else setSortBy((prev) => ({ ...prev, order: prev.order * -1 }));
  };

  const pageHandler = (index) => setPage(index);
  const maxEntitiesHandler = (value) => setMaxEntities(value);

  return (
    <div
      className={classes.wrapper}
      style={maxWidth > 0 ? { maxWidth: maxWidth } : { maxWidth: "100%" }}
    >
      <TableHeader
        maxEntitiesList={maxEntitiesList || DEFAULT_MAX}
        maxEntitiesHandler={maxEntitiesHandler}
        searchHandler={searchHandler}
      />

      <div
        className={
          responsive
            ? `${classes.tNormal} ${classes.tResponsive}`
            : classes.tNormal
        }
      >
        <table
          entries={maxEntities}
          className={combineClasses}
          cellSpacing={"0"}
        >
          <thead>
            <tr>
              {filteredData.columns.map((item, index) => (
                <th
                  key={index}
                  width={item.width + "px"}
                  onClick={sortHandler.bind(null, item.field)}
                >
                  {item.label}
                  {sortBy.name === item.field && (
                    <Fragment>
                      {" "}
                      {sortBy.order === 1 ? (
                        <span>&#x02191;</span>
                      ) : (
                        <span>&#x02193;</span>
                      )}
                    </Fragment>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.rows
              .slice((page - 1) * maxEntities, page * maxEntities)
              .map((item, index) => (
                <tr key={index}>
                  {labels.map((label) => (
                    <td
                      key={`${item.label}${label}`}
                      onClick={() => functions[label] && functions[label](item)}
                    >
                      {item[label]}
                    </td>
                  ))}
                </tr>
              ))}
            {filteredData.rows.slice(
              (page - 1) * maxEntities,
              page * maxEntities
            ).length === 0 && (
              <tr>
                <td colSpan={filteredData.columns.length}>
                  {NO_RESULTS_MESSAGE}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              {filteredData.columns.map((item, index) => (
                <th key={index}>{item.label}</th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <TableFooter
        max={maxEntities}
        page={page}
        filteredLength={filteredData.rows.length}
        totalLength={data.rows.length}
      >
        <Pager max={maxPages} page={page} pageHandler={pageHandler} />
      </TableFooter>
    </div>
  );
};

export default Table;
