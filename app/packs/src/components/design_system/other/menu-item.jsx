import React from 'react';
import Home from 'src/components/icons/Home';

const Menuitem = () => {

    return (
        <>
            <li className="button-topbar mr-1">
                <a href="#" class="nav-link">
                    <Home /> <strong className="m-2">Home</strong>
                </a>
                <Home />
                <strong className="m-2">Connect Wallet</strong>
            </li>

        </>
    )
};

export default Menuitem;