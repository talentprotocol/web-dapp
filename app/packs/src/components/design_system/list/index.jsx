import React from 'react';


const List = ({
    mode,
    photo_url,
    text_main,
    text_secondary,
}) => {

    return (

        <div className="list-container">
            <div className="list-item">
                <img className="column table-img" src={`${photo_url}`} alt="Profile picture"></img>
  	            
                <div className="column">
                    <strong>{text_main}</strong>
  	            </div>

                <div className="column">
                    <span className="main-secondary">{text_secondary}</span>
  	            </div>


            </div>
            <div className="list-item">
                <img className="column table-img" src={`${photo_url}`} alt="Profile picture"></img>

                <div className="column">
                    <strong>{text_main}</strong>
                </div>

                <div className="column">
                    <span className="main-secondary">{text_secondary}</span>
                </div>


            </div>
        </div>

    )
};

export default List;