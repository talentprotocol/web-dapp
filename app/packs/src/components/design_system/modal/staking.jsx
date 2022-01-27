import React from 'react';
import TextInputMax from '../fields/textinput_max';
import Divider from '../other/divider';


const Modal = ({
    mode,
    amount,
}) => {

    return (
        <div className={`modal-dialog ${mode}`}>
            <div className={`modal-content ${mode}`}>
                <div className="modal-header">
                    <strong className={`modal-title ${mode}`}>Staking</strong>

                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className={`modal-body ${mode}`}>
                    <span className={`${mode}`}>The APY is adjusted daily based on the on-chain staking rewards, and the specific APY is subject to the page display on the day.</span>

                    <div className="row mt-2">
                        <div className="col-md-5">
                            <h5 className={`${mode}`}>Lock amount</h5>
                        </div>
                        <div className="col-md-7 text-right">
                            <span className={`availableAmount ${mode}`}>Available amount: {amount} TAL</span>
                        </div>
                    </div>

                    <TextInputMax mode={`${mode}`} placeholder="Please enter the amount" />

                    <div className="mt-1">

                    <Divider mode={`${mode}`}/>

                    <p className={`${mode} mt-1`}>Short Description and amounts user is adding to this staking. Also this can be two or more text lines.</p>

                    <Divider mode={`${mode}`}/>
                    

                        <div className={`form-check ${mode}`}>
                            <input className={`form-check-input ${mode}`} type="checkbox" value=""></input>
                            <label className={`form-check-label ${mode}`}>I have read and I agree to <a href="#">Talent Protocol Staking Service Agreement</a></label>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary button-confirm" style={{ width: '100%' }}>Confirm</button>
                </div>
            </div>
        </div>
    )
};

export default Modal;