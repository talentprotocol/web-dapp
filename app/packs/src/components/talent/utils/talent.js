export const completeProfile = (args) => {
  return missingFields(args).length == 0;
};

export const missingFields = ({
  talent,
  profilePictureUrl,
  token,
  career_goal,
}) => {
  const fields = [];

  if (!talent.profile?.occupation || talent.profile.occupation == "") {
    fields.push("Occupation");
  }
  if (!talent.profile?.headline || talent.profile.headline == "") {
    fields.push("Bio");
  }
  if (!profilePictureUrl || profilePictureUrl == "") {
    fields.push("Profile picture");
  }
  if (!token.ticker || token.ticker == "") {
    fields.push("Ticker");
  }
  if (!career_goal?.pitch || career_goal.pitch == "") {
    fields.push("Pitch");
  }

  return fields;
};

export const profileProgress = ({
  talent,
  profilePictureUrl,
  token,
  career_goal,
  milestones,
  goals,
  perks,
  secondary_tags,
  user,
}) => {
  let total = 100;
  const fields = missingFields({
    talent,
    profilePictureUrl,
    token,
    career_goal,
  });

  if (milestones.length == 0) {
    total -= 10;
  }

  if (goals.length == 0) {
    total -= 10;
  }

  if (perks.length == 0) {
    total -= 10;
  }

  if (secondary_tags.length == 0) {
    total -= 10;
  }

  if (!user.wallet_id || user.wallet_id == "") {
    total -= 10;
  }

  return total - fields.length * 10;
};
