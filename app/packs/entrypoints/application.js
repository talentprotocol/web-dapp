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
import Pagination from "src/components/pagination";
import TalentShow from "src/components/talent/TalentShow";
import MessageUserList from "src/components/chat/MessageUserList";
import Chat from "src/components/chat/Chat";
import TalentNameSearch from "src/components/talent/TalentNameSearch";
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
import Profile from "src/components/talent/Edit/Profile";
import NewPortfolio from "src/components/portfolio/NewPortfolio";
import EditSupporter from "src/components/supporters/EditSupporter";
import Discovery from "src/components/discovery";
import TalentPage from "src/components/talent/TalentPage";

import "stylesheets/application.scss";

require.context("../images", true);

ReactOnRails.register({
  UpcomingTalents,
  Pagination,
  TalentShow,
  MessageUserList,
  Chat,
  RegistrationFlow,
  TalentNameSearch,
  Login,
  Web3ModalConnect,
  TopBar,
  Notifications,
  WelcomePopup,
  BottomNav,
  TopBar,
  Profile,
  NewPortfolio,
  EditSupporter,
  ResetPassword,
  ChangePassword,
  Discovery,
  TalentPage,
});

Rails.start();

// TO ENABLE ACTIVE STORAGE LATER
// import * as ActiveStorage from "@rails/activestorage"
// ActiveStorage.start()
