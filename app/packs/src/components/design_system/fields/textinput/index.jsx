import React from 'react';

const TextInput = ({
    title,
    shortCaption,
    placeholder,
    mode,
    disabled,
}) => {

    return (
        <div>
            <div>
                <h6 className={`title-field ${mode}`}>{title}</h6>
            </div>
            <input type="text" className={`form-control ${mode}`} placeholder={placeholder} disabled={disabled} />
            
            <p className={`short-caption ${mode}`}>{shortCaption}</p>
        </div>
    )
};

export default TextInput;