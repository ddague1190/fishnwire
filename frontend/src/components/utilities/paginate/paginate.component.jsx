import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./paginate.styles.scss";

const Paginate = ({ pages, page }) => {
  const keyword = useSelector((state) => state.keyword);
  const { pathname, search } = useLocation();
  const route = keyword ? `/products/?keyword=${keyword}&` : `${pathname}?`;

  return (
    pages > 1 && (
      <div className='pagination'>
        <label className='pagination__label'>Page</label>
        <div className='pagination__container'>
          {[...Array(pages).keys()].map((x) => (
            <Link key={x + 1} to={`${route}page=${x + 1}`}>
              <span
                className={`pagination__link ${
                  x + 1 === page && "pagination__link--active"
                }`}>
                {x + 1}
              </span>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default Paginate;
