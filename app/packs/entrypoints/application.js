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
import Button from "src/components/button";
import Navbar from "src/components/navbar";
import Pagination from "src/components/pagination";
import NavTabs from "src/components/navbar/NavTabs";
import TalentShow from "src/components/talent/TalentShow";
import MessageUserList from "src/components/chat/MessageUserList";
import Chat from "src/components/chat/Chat";
import TalentNameSearch from "src/components/talent/TalentNameSearch";
import Logo from "src/components/logo";
import MetamaskConnect from "src/components/login/MetamaskConnect";
import Portfolio from "src/components/portfolio/Portfolio";
import UserMenu from "src/components/user_menu";
import UpcomingTalents from "src/components/talent/UpcomingTalents";
import ActiveTalents from "src/components/talent/ActiveTalents";
import TalentTable from "src/components/talent/TalentTable";
import Home from "src/components/home/Home";
import Notifications from "src/components/notifications";
import WelcomePopup from "src/components/one_time_popups/WelcomePopup";
import InviteUsers from "src/components/admin/InviteUsers";

// New Layout components - @TODO: we need to check which of the above components we'll still be using or not

import RegistrationFlow from "src/components/registration/RegistrationFlow";
import Login from "src/components/login/Login";
import ResetPassword from "src/components/login/ResetPassword";
import ChangePassword from "src/components/login/ChangePassword";
import SideBar from "src/components/design_system/side_bar";
import BottomNav from "src/components/design_system/bottom_nav";
import TopBar from "src/components/design_system/top_bar";
import TopNav from "src/components/design_system/top_nav"; // this is the mobile one
import Profile from "src/components/talent/Edit/Profile";
import NewPortfolio from "src/components/portfolio/NewPortfolio";
import EditSupporter from "src/components/supporters/EditSupporter";

import "stylesheets/application.scss";

require.context("../images", true);

ReactOnRails.register({
  ActiveTalents,
  UpcomingTalents,
  Button,
  Navbar,
  Pagination,
  NavTabs,
  TalentShow,
  MessageUserList,
  Chat,
  RegistrationFlow,
  TalentNameSearch,
  Login,
  Logo,
  MetamaskConnect,
  Portfolio,
  UserMenu,
  TalentTable,
  Home,
  Notifications,
  WelcomePopup,
  InviteUsers,
  SideBar,
  BottomNav,
  TopBar,
  TopNav,
  Profile,
  NewPortfolio,
  EditSupporter,
  ResetPassword,
  ChangePassword,
});

Rails.start();

// TO ENABLE ACTIVE STORAGE LATER
// import * as ActiveStorage from "@rails/activestorage"
// ActiveStorage.start()
