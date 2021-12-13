import React from 'react';
import ArrowBack from 'src/components/icons/ArrowBack';
import ArrowForward from 'src/components/icons/ArrowForward';
import Bell from 'src/components/icons/Bell';
import Metamask from 'src/components/icons/Metamask';
import ArrowDown from 'src/components/icons/ArrowDown';


const TopBar = ({
    mode,
    name,
    photo_url,
    count_notifications = 0,
    is_connected = false,
    wallet_balance,
    wallet_address
}) => {

    return (
        <>
            <nav className={`navbar ${mode}`}>
                <div className="col-lg-6">
                    <button className={`button-topbar button-square ${mode}`}>
                        <ArrowBack color={`${mode === 'dark' ? "#FFFFFF" : "#202122"}`} />
                    </button>

                    <button className={`button-topbar button-square ml-1 ${mode}`} disabled>
                        <ArrowForward color={`${mode === 'dark' ? "#FFFFFF" : "#202122"}`}/>
                    </button>
                </div>
                <div className="col-lg-6 text-right">

                    {is_connected == false ? 
                        <button className={`button-topbar mr-1 ${mode}`}>
                            <Metamask />
                            <strong className="m-2">Connect Wallet</strong>
                        </button>

                        :

                        <button className={`button-topbar mr-1 ${mode}`}>
                            {wallet_balance ? <strong className={`m2 wallet_balance ${mode}`}>{wallet_balance}</strong> : null} 
                            {wallet_address ? <strong className={`wallet_address mr-1 ${mode}`}> {wallet_address}</strong> : null}
                        </button>}

                    

                    <button className={`button-topbar mr-1 ${mode}`}>
                        <img className="column table-img" src={`${photo_url}`} alt="Profile picture"></img>

                        <strong className="ml-1 mr-1">{name}</strong>
                        <ArrowDown color={`${mode === 'dark' ? "#FFFFFF" : "#202122"}`} />
                    </button>

                    <button className={`button-topbar button-square ${mode}`}>
                        <Bell color={`${mode === 'dark' ? "#FFFFFF" : "#202122"}`} />
                        {count_notifications > 0 ? <div className="mr-1 ellipse-notifications"></div> : null}
                    </button>

                </div>
            </nav>
        </>
    )
};

export default TopBar;