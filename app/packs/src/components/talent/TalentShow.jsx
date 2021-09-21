import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import Modal from "react-bootstrap/Modal";
import {
  faGithub,
  faTwitter,
  faLinkedin,
  faDiscord,
  faTelegram,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseJSON, formatDistanceToNow } from "date-fns";
import parse from "html-react-parser";
import TalentProfilePicture from "./TalentProfilePicture";

import EditProfile from "./Show/EditProfile";
import TalentTags from "./TalentTags";

const TalentShow = ({
  talent,
  services,
  token,
  perks,
  milestones,
  current_user_id,
  token_live,
  user,
  profilePictureUrl,
  primary_tag,
  secondary_tags,
  career_goal,
  goals,
  posts,
}) => {
  const talentIsFromCurrentUser = talent.user_id == current_user_id;
  const [show, setShow] = useState(false);

  const ticker = () => (token.ticker ? `$${token.ticker}` : "");
  const allTags = () => [primary_tag].concat(secondary_tags);
  const displayName = () => {
    if (talent.profile.website) {
      return (
        <a href={talent.profile.website} className="text-reset">
          {user.display_name || user.username}
        </a>
      );
    }
    return user.display_name || user.username;
  };

  const picture = () => {
    if (talent.profile.video) {
      return (
        <>
          <Modal
            size="lg"
            scrollable={true}
            fullscreen={"md-down"}
            show={show}
            onHide={() => setShow(false)}
            centered
            contentClassName="talent-video-height"
          >
            <ReactPlayer
              url={talent.profile.video}
              light
              width={"100%"}
              height={"100%"}
            />
          </Modal>
          <button className="btn p-0 border-0" onClick={() => setShow(true)}>
            <img
              src={profilePictureUrl}
              className="card-img-top"
              alt="Profile Picture"
            />
          </button>
        </>
      );
    }

    return (
      <img
        src={profilePictureUrl}
        className="card-img-top"
        alt="Profile Picture"
      />
    );
  };

  return (
    <div className="d-flex flex-column">
      <div className="card border-0 rounded-0" style={{ width: "100%" }}>
        {picture()}
        <div className="card-body">
          <h1 className="h2 card-title mb-0">
            <strong>{displayName()}</strong> <small>{ticker()}</small>
          </h1>
          <div className="d-flex flex-column">
            <small className="text-muted mb-2 ml-1 w-100">
              {talent.profile.wallet_address || user.wallet_id}
            </small>
            {talent.profile.pronouns && (
              <small className="text-muted mb-2 ml-1">
                {talent.profile.pronouns}
              </small>
            )}
            {talent.profile.location && (
              <small className="text-muted mb-2 ml-1">
                {talent.profile.location}
              </small>
            )}
          </div>
          <TalentTags tags={allTags()} />
          <p className="card-text mt-2">{talent.profile.headline}</p>

          <section className="d-flex flex-column">
            <h6 className="talent-show-h6 p-2 bg-primary text-white">
              Sponsor Perks
            </h6>
            {perks.map((perk) => (
              <div key={`perk_list_${perk.id}`} className="ml-2">
                <small>
                  <strong>
                    {perk.price} {ticker()}
                  </strong>
                </small>
                <p>{perk.title}</p>
              </div>
            ))}
          </section>
          <section className="d-flex flex-column">
            <h6 className="talent-show-h6 p-2 bg-primary text-white">
              Token Utility
            </h6>
            {services.map((service) => (
              <div key={`service_list_${service.id}`} className="ml-2">
                <small>
                  <strong>
                    {service.price} {ticker()}
                  </strong>
                </small>
                <p>{service.title}</p>
              </div>
            ))}
          </section>
          <section className="d-flex flex-column">
            <h6 className="talent-show-h6 p-2 bg-primary text-white">
              Career Goal(s)
            </h6>
            <h6 style={{ textDecoration: "underline" }}>
              <strong>Bio</strong>
            </h6>
            <p>{career_goal.bio}</p>
            <h6 style={{ textDecoration: "underline" }}>
              <strong>Pitch</strong>
            </h6>
            <p>{career_goal.pitch}</p>
            <h6 style={{ textDecoration: "underline" }}>
              <strong>Challenges</strong>
            </h6>
            <p>{career_goal.challenges}</p>
            <h6 style={{ textDecoration: "underline" }}>
              <strong>Goals</strong>
            </h6>
            <div className="d-flex flex-row mb-2">
              <div className="border-right p-0"></div>
              <div className="col-11 p-0">
                {goals.map((goal) => (
                  <div key={`goal_list_${goal.id}`} className="ml-2">
                    <small>
                      <strong>
                        {goal.due_date} {ticker()}
                      </strong>
                    </small>
                    <p>{goal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="d-flex flex-column mb-2">
            <h6 className="talent-show-h6 p-2 bg-primary text-white">
              Career Timeline
            </h6>
            {milestones.map((milestone) => (
              <div
                key={`milestone_list_${milestone.id}`}
                className="w-100 mt-2"
              >
                <div className="d-flex flex-row w-100 justify-content-between">
                  <h6 className="mb-1" style={{ textDecoration: "underline" }}>
                    <strong>{milestone.title}</strong>
                  </h6>
                  <small>{milestone.start_date}</small>
                </div>
                <small className="text-left">
                  <i>
                    <a href={milestone.link} className="text-reset">
                      {milestone.institution}
                    </a>
                  </i>
                </small>
                <p className="mb-1">{milestone.description}</p>
              </div>
            ))}
          </section>
          <section className="d-flex flex-column">
            <h6 className="talent-show-h6 p-2 bg-primary text-white">Posts</h6>
            {posts.map((post) => (
              <div
                key={`post_list_${post.id}`}
                className="d-flex flex-row w-100 pt-3 pl-4 pr-2 border-bottom"
              >
                <TalentProfilePicture src={profilePictureUrl} height={40} />
                <div className="d-flex flex-column pl-3 w-100">
                  <div className="d-flex flex-row justify-content-between">
                    <p>
                      <strong>{user.display_name || user.username}</strong>{" "}
                      <small className="text-muted">
                        {"\u25CF"}{" "}
                        {formatDistanceToNow(parseJSON(post.created_at))}
                      </small>
                    </p>
                    <p>
                      <small>
                        <span className="text-primary">{ticker()}</span>
                      </small>
                    </p>
                  </div>
                  <p className="w-100 text-white-space-wrap">
                    {parse(post.text)}
                  </p>
                </div>
              </div>
            ))}
          </section>
          <section className="d-flex flex-column mt-2">
            <h6 className="talent-show-h6 p-2 bg-primary text-white">Social</h6>
            <div className="d-flex flex-row">
              {talent.profile.github && (
                <a href={talent.profile.github} className="mr-2 text-black">
                  <FontAwesomeIcon icon={faGithub} size="lg" />
                </a>
              )}
              {talent.profile.linkedin && (
                <a href={talent.profile.linkedin} className="mr-2 text-black">
                  <FontAwesomeIcon icon={faLinkedin} size="lg" />
                </a>
              )}
              {talent.profile.twitter && (
                <a href={talent.profile.twitter} className="mr-2 text-black">
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
              )}
              {talent.profile.instagram && (
                <a href={talent.profile.instagram} className="mr-2 text-black">
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
              )}
              {talent.profile.telegram && (
                <a href={talent.profile.telegram} className="mr-2 text-black">
                  <FontAwesomeIcon icon={faTelegram} size="lg" />
                </a>
              )}
              {talent.profile.discord && (
                <a href={talent.profile.discord} className="mr-2 text-black">
                  <FontAwesomeIcon icon={faDiscord} size="lg" />
                </a>
              )}
              {talent.profile.email && (
                <a
                  href={`mailto:${talent.profile.email}`}
                  className="mr-2 text-black"
                >
                  <FontAwesomeIcon icon={faEnvelope} size="lg" />
                </a>
              )}
            </div>
          </section>
        </div>
      </div>

      <EditProfile
        talent={talent}
        user={user}
        primary_tag={primary_tag}
        secondary_tags={secondary_tags}
        profilePictureUrl={profilePictureUrl}
        career_goal={career_goal}
        services={services}
        token={token}
        goals={goals}
        token_live={token_live}
        perks={perks}
        milestones={milestones}
        allowEdit={talentIsFromCurrentUser}
      />
    </div>
  );
};

export default TalentShow;
