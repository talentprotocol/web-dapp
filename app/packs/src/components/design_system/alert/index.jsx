import React from 'react';
import Success from 'src/components/icons/Success';
import Warning from 'src/components/icons/Warning';
import Info from 'src/components/icons/Info';
import Critical from 'src/components/icons/Critical';


const Alert = ({
    type,
    mode,
    title,
    message,
    link,
}) => {

    return (
        <div className="col-md-4">
            <div className={`alert ${mode} alert-${type} alert-dismissible d-flex`}>
                <div>
                    {type === 'success' && <Success />}
                    {type === 'warning' && <Warning />}
                    {type === 'info' && <Info />}
                    {type === 'critical' && <Critical />}
                </div>
                <div className="alertRightArea">
                    <strong>{title}</strong> 
                    <p>{message}</p>

                    {link ? <a href={`${link}`} target="_blank">Go to link page</a> : null}

                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                </div>
            </div>

        </div>


    )
};

export default Alert;