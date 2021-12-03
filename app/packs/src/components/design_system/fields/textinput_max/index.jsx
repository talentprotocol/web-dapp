import React from 'react';
import TextInput from '../textinput';


const TextInputMax = ({
    placeholder,
    mode,
    disabled,
}) => {

    return (
        <>
            <div class="input-group border-0">
                <input type="number" className={`form-control border-0 ${mode}`} placeholder={placeholder} disabled={disabled} />

                <div className={`form-control input-group-append col-3 border-0 ${mode}`}>
                    <div className={`${mode}`}>
                        <span className={`${mode}`}>TAL | <a href="#"><strong>Max</strong></a> </span>
                    </div>
                </div>
            </div>

        </>
    )
};

export default TextInputMax;