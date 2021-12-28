import React, { useMemo } from "react";
import dayjs from "dayjs";

import ProjectCard from "src/components/design_system/cards/project";

const Timeline = ({ sharedState, mode }) => {
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
        {sortedTimeline.map((milestone) => (
          <div
            key={`milestone_list_${milestone.id}`}
            className="d-flex flex-row w-100 mb-3"
          >
            <div className="col-3 d-flex flex-column justify-content-center">
              <small>{milestone.start_date}</small>
            </div>
            <div className="col-9">
              <ProjectCard
                mode={mode}
                organization={milestone.institution}
                title={milestone.title}
                description={milestone.description}
                website_link={milestone.link}
              />
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Timeline;
