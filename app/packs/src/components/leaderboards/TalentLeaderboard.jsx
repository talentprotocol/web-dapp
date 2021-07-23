import React from 'react'
import TalentProfilePicture from '../talent/TalentProfilePicture'

const TalentLeaderboard = ({ topTalents, className }) => {
  
  return (
    <div className={`d-flex flex-row flex-wrap border p-3 ${className}`}>
      <p className="mb-0 col-9"><small><strong>Top Talent</strong></small></p>
      <p className="mb-0 col-3 text-right text-muted"><small>VALUE</small></p>
      {topTalents.map((topTalent) => (
        <a href={`/talent/${topTalent.id}`} className="mt-2 col-12 d-flex flex-row p-0 align-items-center text-reset" key={`talent-leaderboard-tal-${topTalent.id}`}>
          <div className="col-9 d-flex flex-row align-items-center">
            <TalentProfilePicture src={topTalent.profilePictureUrl} height={28}/>
            <div className="d-flex flex-column ml-3">
              <p className="mb-0 leaderboard-info"><small><strong>{topTalent.name}</strong></small></p>
              <p className="mb-0 text-muted leaderboard-info"><small>{topTalent.ticker}</small></p>
            </div>
          </div>
          <p className="mb-0 col-3 text-right text-muted leaderboard-info"><small>{topTalent.price}</small></p>
        </a>
      ))}
    </div>
  )
}

export default TalentLeaderboard