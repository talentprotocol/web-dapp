import React from 'react';
import LogoWithText from 'src/components/design_system/other/logo-with-text';
import MenuItem from 'src/components/design_system/other/menu-item';

const SideBar = ({
    type,
    mode,
}) => {

    return (
        <>
            <div className="col-md-4">
                <LogoWithText />

                <ul class="nav nav-pills flex-column mb-auto">
                    <MenuItem />
                </ul>
            </div>
        </>
    )
};

export default SideBar;