import React, { useState, useContext } from "react";
import Web3Container, { Web3Context } from "src/contexts/web3Context";
import currency from "currency.js";

import { faBell, faBellSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../pagination";
import Post from "./Post";
import PostInput from "./PostInput";
import TalentLeaderboard from "../leaderboards/TalentLeaderboard";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Alert from "../alert";
import Button from "../button";
import { patch } from "src/utils/requests";

const Feed = ({ posts, user, pagy, topTalents, alert, notifications }) => {
  const [currentPosts, setCurrentPosts] = useState(posts);
  const [currentNotifications] = useState(notifications);
  const web3 = useContext(Web3Context);

  const priceOfToken = (post) => {
    if (post.user.ticker == "$TAL") {
      return currency(web3.talToken?.price).format();
    }
    if (web3.tokens[post.user.contract_id]?.dollarPerToken) {
      const dollar = web3.tokens[post.user.contract_id]?.dollarPerToken;

      return currency(dollar * web3.talToken?.price).format();
    }
  };

  const addPost = (post) => {
    setCurrentPosts([post, ...currentPosts]);
  };

  const hrefForNotification = (type, talentId, sourceTalentId) => {
    switch(type) {
      case 'Notifications::TokenAcquired':
        return `/talent/${talentId}/sponsors`;
      case 'Notifications::MessageReceived':
        return '/messages';
      case 'Notifications::TalentListed':
        return '/talent';
      case 'Notifications::TalentChanged':
        return `/talent/${sourceTalentId}`;
      default:
        return '';
    }
  }

  const notificationsUnread = currentNotifications.some((notif) => notif.read === false)

  const notificationRead = async (notificationId) => {
    await patch(`/api/v1/notifications/${notificationId}`, { notification: { read: true } });
  };

  return (
    <>
      <section className="col-lg-7 mx-auto mx-lg-0 px-0 d-flex flex-column tal-content-side-700 pt-3">
        <div className="d-flex justify-content-between pb-2 mb-0 border-bottom">
          <h1 className="h5 px-2">
            <strong>Home</strong>
          </h1>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover
                id="notifications-popover"
                className="w-25 overflow-auto"
                style={{ maxHeight: 400 }}
              >
                {currentNotifications.length == 0 &&  <p className="w-100 text-center">No notifications</p>}
                {currentNotifications.map((notification) => (
                  <div className="w-100 my-2" key={`notification-${notification.id}`}>
                    <Button
                      type={`${notification.read ? "outline-secondary" : "primary"}`}
                      href={hrefForNotification(notification.type, notification.talent_id, notification.source_talent_id)}
                      text={notification.body}
                      className="border-bottom border-top border-right border-left w-100 notification-link"
                      onClick={() => notification.read ? null : notificationRead(notification.id)}
                    />
                  </div>
                ))}
              </Popover>
            }
          >
            <button className="border-0 bg-transparent">
              <FontAwesomeIcon icon={notificationsUnread ? faBell : faBellSlash} />
            </button>
          </OverlayTrigger>
        </div>
        {user.isTalent && (
          <div className="px-2 bg-white border-right">
            <PostInput
              profilePictureUrl={user.profilePictureUrl}
              addPost={(post) => addPost(post)}
            />
          </div>
        )}
        {currentPosts.length == 0 && (
          <p className="mx-2">
            Start following or investing in talent for us to construct your
            feed.
          </p>
        )}
        {currentPosts.map((post) => (
          <div
            key={`post-${post.id}`}
            className="bg-white border-bottom border-right border-top mb-2"
          >
            <Post
              post={post}
              user={post.user}
              currentUser={user}
              priceOfToken={priceOfToken(post)}
            />
          </div>
        ))}
        {currentPosts.length > 0 && (
          <Pagination
            prev={pagy.prev}
            next={pagy.next}
            page={pagy.page}
            last={pagy.last}
          />
        )}
      </section>
      <section className="col-lg-5 p-4 talent-content-body-500">
        <TalentLeaderboard topTalents={topTalents} className="mb-4" />
        {alert.type && (
          <Alert direction="column" centerText={true} {...alert}>
            <p className={`px-5 pt-4 mr-md-3 text-center`}>{alert.text}</p>{" "}
            {alert.href && (
              <Button
                type={alert.type}
                text={alert.buttonText}
                href={alert.href}
                target="self"
                className="talent-button w-100 mx-5 mb-4"
              />
            )}
          </Alert>
        )}
      </section>
    </>
  );
};

const ConnectedFeed = (props) => (
  <Web3Container>
    <Feed {...props} />
  </Web3Container>
);

export default ConnectedFeed;
