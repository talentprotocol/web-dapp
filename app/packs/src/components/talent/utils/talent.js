export const completeProfile = ({
  talent,
  primary_tag,
  profilePictureUrl,
  token,
  career_goal,
  milestones,
  goals,
}) => {
  const validOccupation =
    talent.profile?.occupation && talent.profile.occupation != "";
  const validLocation =
    talent.profile?.location && talent.profile.location != "";
  const validHeadline =
    talent.profile?.headline && talent.profile.headline != "";
  const validPrimaryTag = primary_tag && primary_tag != "";
  const validProfilePicture = profilePictureUrl && profilePictureUrl != "";
  const validTokenTicker = token.ticker && token.ticker != "";
  const validCareerGoalBio = career_goal?.bio && career_goal.bio != "";
  const validCareerGoalPitch = career_goal?.pitch && career_goal.pitch != "";
  const validCareerGoalChallenges =
    career_goal?.challenges && career_goal.challenges != "";
  const validMilestones = milestones.length > 0;
  const validGoals = goals.length > 0;

  return (
    !!validOccupation &&
    !!validLocation &&
    !!validHeadline &&
    !!validPrimaryTag &&
    !!validProfilePicture &&
    !!validTokenTicker &&
    !!validCareerGoalBio &&
    !!validCareerGoalPitch &&
    !!validCareerGoalChallenges &&
    !!validMilestones &&
    !!validGoals
  );
};
