import React from "react";
// Global styles need to be imported here so that storybook picks them up
import "stylesheets/application.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "light",
    values: [
      {
        name: "light",
        value: "#fafafb",
      },
      {
        name: "dark",
        value: "#131415",
      },
    ],
  },
};

export const decorators = [
  (Story) => {
    const theme = Story()._owner.pendingProps.parameters.backgrounds.default;

    return (
      <div className={`${theme}-body`}>
        <Story />
      </div>
    );
  },
];
