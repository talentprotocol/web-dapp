import React from "react";

const Icon = ({
    props,
    mode = "light"
}) => {
    return (
        <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"  {...props}>
                <g clip-path="url(#clip0_212_608)">
                    <path d="M0.981358 8.90465C1.60812 10.3794 2.79507 11.5448 4.28109 12.1445C5.76711 12.7441 7.43046 12.7288 8.90524 12.1021C10.38 11.4753 11.5454 10.2884 12.145 8.80235C12.7447 7.31634 12.7294 5.65298 12.1027 4.1782C11.4759 2.70342 10.289 1.53803 8.80295 0.938391C7.31693 0.338756 5.65357 0.353997 4.17879 0.980763C2.70401 1.60753 1.53862 2.79448 0.938985 4.28049C0.33935 5.76651 0.354592 7.42987 0.981358 8.90465V8.90465Z" stroke={mode === 'dark' ? "#FFF" : "#000"} stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.814 10.8133L15.5 15.5" stroke={mode === 'dark' ? "#FFF" : "#000"} stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_212_608">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </>
    )
};

export default Icon;