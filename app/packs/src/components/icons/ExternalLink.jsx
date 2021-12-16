import React from "react";
import Icon from "src/components/design_system/icon";

const ExternalLink = (props) => (
  <Icon
    path="M6.16666 9.682L15.5 0.5 M15.5 5.74733V0.5H10.1667 M8.08333 3.83333H1.08333C0.928624 3.83333 0.780251 3.89479 0.670854 4.00419C0.561458 4.11358 0.5 4.26196 0.5 4.41667V14.9167C0.5 15.0714 0.561458 15.2197 0.670854 15.3291C0.780251 15.4385 0.928624 15.5 1.08333 15.5H11.5833C11.738 15.5 11.8864 15.4385 11.9958 15.3291C12.1052 15.2197 12.1667 15.0714 12.1667 14.9167V7.91667"
    {...props}
  />
);

export default ExternalLink;