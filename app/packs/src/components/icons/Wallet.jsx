import React from "react";

const Icon = ({
    props,
    mode = "light"
}) => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 16 16"
                {...props}
            >
                <path
                    stroke={mode === 'dark' ? "#FFF" : "#000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.5 12v2.333a1 1 0 01-1 1H2a1.5 1.5 0 01-1.5-1.5V2.167A1.5 1.5 0 012 .667h10.5a1 1 0 011 1v2.166"
                ></path>
                <path
                    stroke={mode === 'dark' ? "#FFF" : "#000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.5 12a1 1 0 001-1V8a1 1 0 00-1-1h-2.833a2.5 2.5 0 100 5H14.5z"
                ></path>
                <path
                    stroke={mode === 'dark' ? "#FFF" : "#000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9.247a.247.247 0 01.247.253.242.242 0 01-.152.23.24.24 0 01-.095.017.247.247 0 01-.253-.247.253.253 0 01.253-.253M14.5 7V4.833a1 1 0 00-1-1H3.753a1.173 1.173 0 01-1.086-.6"
                ></path>
            </svg>
        </>
    )
};

export default Icon;
