import React, { useMemo } from "react";
import dayjs from "dayjs";

const Timeline = ({ sharedState }) => {
  const sortedTimeline = useMemo(() => {
    return sharedState.milestones.sort((first, second) => {
      const firstDate = dayjs(first.start_date);
      const secondDate = dayjs(second.start_date);

      if (firstDate.isAfter(secondDate)) {
        return -1;
      } else if (firstDate.isBefore(secondDate)) {
        return 1;
      }
      return 0;
    });
  }, [sharedState.milestones]);

  return (
    <>
      <section className="d-flex flex-column mt-3 mx-3">
        <h5>Career</h5>
        {sortedTimeline.map((milestone) => (
          <div
            key={`milestone_list_${milestone.id}`}
            className="d-flex flex-row w-100 mb-3"
          >
            <div className="col-3">
              <small>{milestone.start_date}</small>
            </div>
            <div className="col-9 d-flex flex-column">
              <h6 className="mb-1">
                <strong>{milestone.title}</strong>
              </h6>
              <small className="text-warning">
                <i>
                  <a
                    href={milestone.link}
                    target="_blank"
                    className="text-reset"
                  >
                    {milestone.institution}
                  </a>
                </i>
              </small>
              <p className="mb-1">{milestone.description}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Timeline;
