import classes from "./TableHeader.module.css";

const TableHeader = ({
  maxEntitiesList,
  maxEntitiesHandler,
  searchHandler,
}) => (
  <div className={classes.tableHeader}>
    <div>
      Show:{" "}
      {maxEntitiesList?.length > 0 ? (
        <select onChange={(event) => maxEntitiesHandler(event.target.value)}>
          {maxEntitiesList.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      ) : (
        maxEntitiesList
      )}{" "}
      entries
    </div>
    <div>
      Search: <input type={"search"} onChange={searchHandler} />
    </div>
  </div>
);

export default TableHeader;
