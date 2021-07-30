import React, { useState } from "react"
import ReactPlayer from "react-player/youtube"

import { post, destroy } from "src/utils/requests"
import LinkedInIcon from "images/linkedin.png"

import Button from '../button'
import TalentProfilePicture from './TalentProfilePicture'
import TalentTags from "./TalentTags"

const CareerGoals = ({ careerGoals }) => {
  return (
    <div className="mb-3 mb-md-5">
      <h6 className="talent-show-h6 p-2 d-inline">CAREER GOALS</h6>
      {careerGoals.map((careerGoal, index) => (<p className="mt-3 mb-0 talent-long-description" key={`career-goal-${index}`}>{careerGoal.description}</p>))}
    </div>
  )
}

const Rewards = ({ rewards }) => {
  return (
    <div className="mb-3 mb-md-5">
      <h6 className="talent-show-h6 p-2 d-inline mb-2">BENEFITS</h6>
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

const AboutMe = ({ description, youtubeUrl }) => {
  return (
    <div className="mb-3 mb-md-5">
      <h6 className="talent-show-h6 p-2 d-inline mb-3">ABOUT ME</h6>
      <p className="mt-3 mb-0 talent-long-description" >{description}</p>
      {youtubeUrl && <div className="talent-profile-video-player mt-3 mx-auto">
        <ReactPlayer url={youtubeUrl} light width={"100%"} height={"100%"}/>
      </div>}
    </div>
  )
}

const TalentDetail = ({ profilePictureUrl, username, ticker, tags, linkedinUrl }) => {
  return (
    <div className="mb-3 mb-md-5 d-flex flex-column flex-md-row align-items-center">
      <TalentProfilePicture src={profilePictureUrl} height={96}/>
      <div className="d-flex flex-column ml-2">
        <h1 className="h2"><small>{username} <span className="text-muted">({ticker})</span></small></h1>
        <TalentTags tags={tags}/>
      </div>
      <div className="ml-md-auto d-flex flex-row-reverse flex-md-column justify-content-between align-items-end mt-2 mt-md-0">
        <a className="mt-0 mt-md-2" href={linkedinUrl}><img src={LinkedInIcon} height={24} alt="LinkedIn Icon" className="greyscale-img"/></a>
      </div>
    </div>
  )
}

const TalentShow = ({ talent, careerGoals, rewards }) => {
  return (
    <div className="d-flex flex-column">
      <TalentDetail
        username={talent.username}
        profilePictureUrl={talent.profilePictureUrl}
        ticker={talent.ticker}
        tags={talent.tags}
        linkedinUrl={talent.linkedinUrl}
        />
      <AboutMe description={talent.description} youtubeUrl={talent.youtubeUrl}/>
      <CareerGoals careerGoals={careerGoals} />
      <Rewards rewards={rewards}/>
    </div>
  )
}

export default TalentShow
