import React, { useEffect } from "react";
import { P2 } from "src/components/design_system/typography";
import { CheckBold } from "src/components/icons";

const ProgressCircle = ({
  id,
  width,
  progress,
  completedTasks,
  allTasks,
  done = false,
}) => {
  const setProgress = (circle, progress) => {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
  };

  useEffect(() => {
    if (
      document.getElementById(`circle-${id}`)?.querySelector(".progress-ring")
    ) {
      setProgress(
        document.getElementById(`circle-${id}`).querySelector(".progress-ring"),
        progress
      );
    }
  }, [
    document.getElementById(`circle-${id}`)?.querySelector(".progress-ring"),
  ]);

  return (
    <div className="whole-ring" id={`circle-${id}`}>
      {done ? (
        <CheckBold className="position-absolute" color="#1DB954" size={21} />
      ) : (
        <div className="d-flex position-absolute">
          <P2 className="text-black" bold text={`${completedTasks}`} />
          <P2 className="px-1 text-primary-04" bold text="/" />
          <P2 className="text-primary-04" bold text={`${allTasks}`} />
        </div>
      )}
      <svg width={width + 6} height={width + 6}>
        <circle
          className="ring"
          strokeWidth="3"
          fill="transparent"
          r={width / 2}
          cx={(width + 6) / 2}
          cy={(width + 6) / 2}
          strokeDashoffset={0}
        />
        <circle
          className="progress-ring"
          stroke={progress === 1 ? "#1DB954" : "#7A55FF"}
          strokeWidth="3"
          fill="transparent"
          r={width / 2}
          cx={(width + 6) / 2}
          cy={(width + 6) / 2}
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;
