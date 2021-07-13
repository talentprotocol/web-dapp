import React from "react"
import TalentProfilePicture from './TalentProfilePicture'
import TalentTags from "./TalentTags"
import LinkedInIcon from "images/linkedin.png"

const CareerGoals = ({ careerGoals }) => {
  return (
    <div className="mb-5">
      <h6 className="talent-show-h6 p-2 d-inline">CAREER GOALS</h6>
      {careerGoals.map((careerGoal, index) => (<p className="mt-3 mb-0" key={`career-goal-${index}`}>{careerGoal.description}</p>))}
    </div>
  )
}

const Rewards = ({ rewards }) => {
  return (
    <div className="mb-5">
      <h6 className="talent-show-h6 p-2 d-inline mb-2">REWARDS</h6>
      {rewards.map((reward, index) => (
        <div className={`${index > 0 ? 'mt-3' : 'mt-4'}`} key={`reward-description-${index}`}>
          <p className="mb-0 py-1 px-2 tal-reward-amount d-inline">
            <small><strong>✦ {reward.required_amount} career coins</strong></small>
          </p>
          <p className="mt-2 mb-0">{reward.description}</p>
        </div>
      ))}
    </div>
  )
}

const AboutMe = ({ description }) => {
  return (
    <div className="mb-5">
      <h6 className="talent-show-h6 p-2 d-inline mb-3">ABOUT ME</h6>
      <p className="mt-3 mb-0" >{description}</p>
    </div>
  )
}

const TalentDetail = ({ profilePictureUrl, username, ticker, tags, linkedinUrl }) => {
  return (
    <div className="mb-5 d-flex flex-row align-items-center">
      <TalentProfilePicture src={profilePictureUrl} height={96}/>
      <div className="d-flex flex-column ml-2">
        <h1 className="h2"><small>{username} <span className="text-muted">({ticker})</span></small></h1>
        <TalentTags tags={tags}/>
      </div>
      <a className="ml-auto" href={linkedinUrl}><img src={LinkedInIcon} height={24} alt="LinkedIn Icon" /></a>
    </div>
  )
}

const TalentShow = ({ talent, careerGoals, rewards}) => {
  return (
    <div className="d-flex flex-column">
      <TalentDetail
        username={talent.username}
        profilePictureUrl={talent.profilePictureUrl}
        ticker={talent.ticker}
        tags={talent.tags}
        linkedinUrl={talent.linkedinUrl}
        />
      <AboutMe description={talent.description}/>
      <CareerGoals careerGoals={careerGoals} />
      <Rewards rewards={rewards}/>
    </div>
  )
}

export default TalentShow
