import React, { useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Services = ({ services, ticker, width }) => {
  const [start, setStart] = useState(0);
  const itemsPerRow = width < 768 ? 1 : 3;

  const end =
    services.length > itemsPerRow ? start + itemsPerRow : services.length;
  const sliceInDisplay = services.slice(start, end);

  const slideLeft = () => setStart((prev) => prev - 1);
  const slideRight = () => setStart((prev) => prev + 1);
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= services.length;

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <h5>
          <strong>Services</strong>
        </h5>
        <div className="d-flex flex-row">
          <button
            className="btn btn-secondary"
            onClick={slideLeft}
            disabled={disableLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </button>
          <button
            className="btn btn-secondary ml-2"
            onClick={slideRight}
            disabled={disableRight}
          >
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-3 mb-2">
        {sliceInDisplay.map((service, index) => (
          <div
            key={`service_list_${service.id}`}
            className={`bg-light rounded p-3 ${itemsPerRow == 1 ? 'col-12' : 'lg-w-32'}`}
          >
            <p>{service.title}</p>
            <small className="text-warning">
              <strong>
                {service.price} {ticker}
              </strong>
            </small>
            <button className="btn btn-secondary mt-2" disabled>
              <small>REDEEM</small>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Services;
