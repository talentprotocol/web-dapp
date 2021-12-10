import React from 'react';
import ButtonProfile from 'src/components/design_system/other/button-profile';
import ButtonIconNotifications from 'src/components/design_system/other/button-icon-notifications';
import ButtonConnectWallet from 'src/components/design_system/other/button-connect-wallet';
import ButtonIconArrowBack from 'src/components/design_system/other/button-icon-arrowback';
import ButtonIconArrowForward from 'src/components/design_system/other/button-icon-arrowforward';

const TopBar = ({
    type,
    mode,
    title,
    message,
    link,
    link_text
}) => {

    return (
        <>
            <nav className="navbar">
                <div className="col-lg-6">
                    <ButtonIconArrowBack />
                    <ButtonIconArrowForward />
                </div>
                <div className="col-lg-6 text-right">
                    <ButtonConnectWallet />
                    <ButtonProfile name="Andreas V" photo_url="https://media.istockphoto.com/photos/beautiful-woman-posing-against-dark-background-picture-id638756792?k=20&m=638756792&s=612x612&w=0&h=PAiwpR6vmkBlctx0kmvGKX3HsBcMdd2PFD4BlEEI7Ac=" />
                    <ButtonIconNotifications />


                </div>
            </nav>
        </>
    )
};

export default TopBar;