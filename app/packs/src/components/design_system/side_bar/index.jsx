import React from 'react';
import LogoLight from 'src/components/icons/Logo-Light';
import LogoDark from 'src/components/icons/Logo-Dark';
import Home from 'src/components/icons/Home';
import Talent from 'src/components/icons/Talent';
import Wallet from 'src/components/icons/Wallet';
import Chat from 'src/components/icons/Chat';

const SideBar = ({
    mode,
}) => {

    return (
        <>
            <div className={`side-nav ${mode} col-lg-3 col-md-3 col-sm-6 col-xs-6`}>

                {mode === 'light' ? <LogoLight /> : <LogoDark />}

                <ul className={`menu ${mode}`}>

                    <li>
                        <a href="#" className={`d-flex ${mode} active`}>
                            <div className="menu-icon"><Home color={`${mode === 'dark' ? "#AAADB3" : "#686C74"}`} /></div>
                            <span>Home</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" className={`d-flex ${mode}`}>
                            <div className="menu-icon"><Talent color={`${mode === 'dark' ? "#AAADB3" : "#686C74"}`} /></div>
                            <span>Talent</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" className={`d-flex ${mode}`}>
                            <div className="menu-icon"><Wallet color={`${mode === 'dark' ? "#AAADB3" : "#686C74"}`} /></div>
                            <span>Portfolio</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" className={`d-flex ${mode}`}>
                            <div className="menu-icon"><Chat color={`${mode === 'dark' ? "#AAADB3" : "#686C74"}`} /></div>
                            <span>Messages</span>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    )
};

export default SideBar;