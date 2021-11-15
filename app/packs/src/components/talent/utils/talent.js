export const completeProfile = ({
  talent,
  profilePictureUrl,
  token,
  career_goal,
}) => {
  const validOccupation =
    talent.profile?.occupation && talent.profile.occupation != "";
  const validHeadline =
    talent.profile?.headline && talent.profile.headline != "";
  const validProfilePicture = profilePictureUrl && profilePictureUrl != "";
  const validTokenTicker = token.ticker && token.ticker != "";
  const validCareerGoalPitch = career_goal?.pitch && career_goal.pitch != "";

  return (
    !!validOccupation &&
    !!validProfilePicture &&
    !!validTokenTicker &&
    !!validHeadline &&
    !!validCareerGoalPitch
  );
};
