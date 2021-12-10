import React from 'react';
import LogoLight from 'src/components/icons/Logo-Light';
import LogoDark from 'src/components/icons/Logo-Dark';
import Bell from 'src/components/icons/Bell';
import Search from 'src/components/icons/Search';


const NavTop = ({
    mode
}) => {

    return (
        <>
            <div className="col-lg-3">
                <nav className={`navbar-top-mobile ${mode}`}>
                    <div className="navbar-top-menu">
                        <div className="navbar-top-menu-option">{mode === 'light' ? <LogoLight /> : <LogoDark />} </div>
                        <div className="navbar-top-menu">
                            <div className="navbar-top-menu-option"> <Search color={`${mode === 'dark' ? "#AAADB3" : "#686C74"}`} /> </div>
                            <div className="navbar-top-menu-option"> <Bell color={`${mode === 'dark' ? "#AAADB3" : "#686C74"}`} /> </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
};

export default NavTop;