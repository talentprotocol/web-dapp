import React from 'react'
import DefaultProfilePicture from "images/default-profile-icon.jpg"

const TalentProfilePicture = ({ src, height }) => {
  const imgSrc = src || DefaultProfilePicture
  return (<img className="rounded-circle" src={imgSrc} height={height} alt="Profile Picture" />)
}

export default TalentProfilePicture