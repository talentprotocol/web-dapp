// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
import "core-js/stable";
import "regenerator-runtime/runtime";

import Rails from "@rails/ujs";

import "channels";
import "@fontsource/plus-jakarta-sans";

import ReactOnRails from "react-on-rails";
import TalentShow from "src/components/talent/TalentShow";
import MessageUserList from "src/components/chat/MessageUserList";
import Chat from "src/components/chat/Chat";
import TalentKeywordSearch from "src/components/talent/TalentKeywordSearch";
import Web3ModalConnect from "src/components/login/Web3ModalConnect";
import UpcomingTalents from "src/components/talent/UpcomingTalents";
import Notifications from "src/components/notifications";
import WelcomePopup from "src/components/one_time_popups/WelcomePopup";

// New Layout components - @TODO: we need to check which of the above components we'll still be using or not

import RegistrationFlow from "src/components/registration/RegistrationFlow";
import Login from "src/components/login/Login";
import ResetPassword from "src/components/login/ResetPassword";
import ChangePassword from "src/components/login/ChangePassword";
import BottomNav from "src/components/design_system/bottom_nav";
import TopBar from "src/components/top_bar";
import EditTalent from "src/components/talent/Edit/Profile";
import NewPortfolio from "src/components/portfolio/NewPortfolio";
import EditSupporter from "src/components/supporters/edit/Profile";
import Discovery from "src/components/discovery";
import DiscoveryShow from "src/components/discovery/show";
import TalentPage from "src/components/talent/TalentPage";
import LoggedOutTopBar from "src/components/top_bar/LoggedOutTopBar";
import SupporterProfile from "src/components/supporters/show/Profile";
import Rewards from "src/components/rewards";
import QuestShow from "src/components/rewards/quests/show";
import Footer from "src/components/design_system/footer";
import FirstQuestPopup from "src/components/one_time_popups/FirstQuestPopup";
import FlashMessages from "src/components/FlashMessages";

import "stylesheets/application.scss";

require.context("../images", true);

ReactOnRails.register({
  BottomNav,
  ChangePassword,
  Chat,
  Discovery,
  DiscoveryShow,
  EditSupporter,
  EditTalent,
  Footer,
  LoggedOutTopBar,
  Login,
  MessageUserList,
  NewPortfolio,
  Notifications,
  QuestShow,
  RegistrationFlow,
  ResetPassword,
  Rewards,
  SupporterProfile,
  TalentKeywordSearch,
  TalentPage,
  TalentShow,
  TopBar,
  TopBar,
  UpcomingTalents,
  Web3ModalConnect,
  WelcomePopup,
  FirstQuestPopup,
  FlashMessages,
});

Rails.start();

// TO ENABLE ACTIVE STORAGE LATER
// import * as ActiveStorage from "@rails/activestorage"
// ActiveStorage.start()
