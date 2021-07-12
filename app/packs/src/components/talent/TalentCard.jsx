import React from "react"
import DefaultProfilePicture from "images/default-profile-icon.jpg"

const TalentBadge = ({ status }) => {
  if (status.toLowerCase() == "active") {
    return (
      <small className="text-success talent-status-badge active py-1 px-2">
        <strong>{'\u25CF Active'}</strong>
      </small>
    )
  } else {
    return (
      <small className="text-warning talent-status-badge upcoming py-1 px-2">
        <strong>{'\u25CF Upcoming'}</strong>
      </small>
    )
  }
}

const TalentProfilePicture = ({ src }) => {
  const imgSrc = src || DefaultProfilePicture
  return (<img className="rounded-circle" src={imgSrc} height="64" alt="Profile Picture" />)
}

const TalentTags = ({ tags, talent_id }) => {
  if (tags && tags.length > 0) {
    return (
      <div className="d-flex flex-row">
        {tags.map((tag) =>
          (<div key={`${talent_id}_${tag}`} className="text-regular px-1 mr-1 border border-light rounded-pill">
            <small><strong>{tag}</strong></small>
          </div>))
        }
      </div>
    )
  } else {
    return null
  }
}

const TalentCard = ({ talent, href }) => {
  return (
    <a href={href} className="card talent-link border py-3 h-100">
      <div className="card-body px-3 position-relative">
        <TalentProfilePicture src={talent.profile_picture_url}/>
        <h4 className="card-title mt-2"><strong>{talent.username}</strong></h4>
        <h6 className="card-subtitle mb-2 text-primary"><strong>{talent.coin.display_ticker}</strong></h6>
        <TalentBadge status={talent.status} />
        <p className="card-text"><small>{talent.description}</small></p>
        <TalentTags tags={talent.tags} talent_id={talent.id} />
      </div>
      <div className="d-flex flex-row justify-content-around px-3 border-light talent-border-separator-dashed">
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted"><small>Price</small></div>
          <div><strong>{talent.coin.display_price}</strong></div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted"><small>Market cap</small></div>
          <div><strong>{talent.coin.display_market_cap}</strong></div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted"><small>Sponsors</small></div>
          <div><strong>{talent.sponsor_count}</strong></div>
        </div>
      </div>
    </a>
  )
}

export default TalentCard
