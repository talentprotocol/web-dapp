import React from 'react';
import TextInput from '../fields/textinput';
import Divider from '../other/divider';


const Modal = ({
    type,
    mode,
    title,
    message,
    link,
    link_text
}) => {

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <strong className="modal-title">Staking</strong>

                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <span>The APY is adjusted daily based on the on-chain staking rewards, and the specific APY is subject to the page display on the day.</span>

                    <div className="row divAmount">
                        <div className="col-md-5">
                            <h5>Lock amount</h5>
                        </div>
                        <div className="col-md-7 text-right">
                            <span className="availableAmount text-right">Available amount 5,574.59 TAL</span>
                        </div>
                    </div>

                    <div className="row col-lg-12 divInput">
                        <TextInput mode="light" placeholder="Please enter the amount" />
                    </div>

                    <Divider />

                    <span className="short-description">Short Description and amounts user is adding to this staking. Also this can be two or more text lines.</span>

                    <Divider />
                    

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required></input>
                        <label className="form-check-label" for="invalidCheck">I have read and I agree to <a  href="#">Talent Protocol Staking Service Agreement</a></label>
                    </div>

                    <button type="button" className="btn btn-primary button-confirm" style={{ width: '100%' }}>Confirm</button>
                </div>
            </div>
        </div>
    )
};

export default Modal;