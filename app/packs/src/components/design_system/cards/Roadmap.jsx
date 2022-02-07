import React from "react";
import dayjs from "dayjs";

import { P1, P2, Caption } from "src/components/design_system/typography";

const Roadmap = ({ mode, due_date, title, description, className = "" }) => {
  const formatedDueDate = dayjs(due_date, "YYYY-MM-DD").format("YYYY-MM");

  return (
    <div className={`card ${mode} disabled ${className}`}>
      <Caption className="text-primary mb-4" text={formatedDueDate} bold />
      {title && <P1 className="text-black mb-3" text={title} bold />}
      {description && (
        <P2 className="text-primary-03" text={`${description}`} />
      )}
    </div>
  );
};

export default Roadmap;
