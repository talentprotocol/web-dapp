// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Rails from "@rails/ujs"

import "channels"

import ReactOnRails from "react-on-rails";
import Button from "src/components/button";
import MessageBoard from "src/components/message_board";
import Navbar from "src/components/navbar";
import Alert from "src/components/alert";
import TalentCard from "src/components/talent/TalentCard";
import Pagination from "src/components/pagination";
import NavTabs from 'src/components/navbar/NavTabs';
import TalentShow from "src/components/talent/TalentShow"
import TalentCoin from "src/components/talent/TalentCoin"
import TalentLeaderboard from "src/components/leaderboards/TalentLeaderboard"
import PortfolioTable from "src/components/portfolio/PortfolioTable"
import PortfolioTalOverview from "src/components/portfolio/PortfolioTalOverview"
import DisplayCoinVariance from "src/components/coin/DisplayCoinVariance"

import "stylesheets/application.scss"

require.context('../images', true)

ReactOnRails.register({
  Button,
  MessageBoard,
  Navbar,
  Alert,
  TalentCard,
  Pagination,
  NavTabs,
  TalentShow,
  TalentCoin,
  TalentLeaderboard,
  PortfolioTable,
  PortfolioTalOverview,
  DisplayCoinVariance
});

Rails.start()

// TO ENABLE ACTIVE STORAGE LATER
// import * as ActiveStorage from "@rails/activestorage"
// ActiveStorage.start()
