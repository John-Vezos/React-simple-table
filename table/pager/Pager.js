import classes from "./Pager.module.css";
import { Fragment } from "react";

// const max = 10;
const Pager = ({ max, page, pageHandler }) => {
  return (
    <div className={classes.pager}>
      {max > 1 && (
        <Fragment>
          <button
            name={"previous page"}
            aria-label={"previous page"}
            disabled={page === 1}
            style={page === 1 ? { opacity: ".6" } : { opacity: "1" }}
            onClick={() => pageHandler(page - 1)}
          >
            LEFT
          </button>
          <div>
            <button
              className={page === 1 ? classes.active : null}
              onClick={() => pageHandler(1)}
            >
              1
            </button>
            {page > 3 && <p>...</p>}
            {page > 2 && (
              <button onClick={() => pageHandler(page - 1)}>{page - 1}</button>
            )}
            {page > 1 && page < max && (
              <button className={page === page ? classes.active : null}>
                {page}
              </button>
            )}
            {page < max - 1 && (
              <button onClick={() => pageHandler(page + 1)}>{page + 1}</button>
            )}

            {max - page > 2 && <p>...</p>}

            <button
              className={page === max ? classes.active : null}
              onClick={() => pageHandler(max)}
            >
              {max}
            </button>
          </div>

          <button
            name={"next page"}
            aria-label={"next page"}
            disabled={page === max}
            style={page === max ? { opacity: ".6" } : { opacity: "1" }}
            onClick={() => pageHandler(page + 1)}
          >
            RIGHT
          </button>
        </Fragment>
      )}
    </div>
  );
};
export default Pager;
