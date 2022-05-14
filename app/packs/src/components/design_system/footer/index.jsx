import React, { useContext } from "react";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import { LogoLight, LogoDark } from "src/components/icons";
import { P2 } from "src/components/design_system/typography";
import {
  TALENT_PROTOCOL_GITHUB,
  TALENT_PROTOCOL_DISCORD,
  TALENT_PROTOCOL_TWITTER,
  TALENT_PROTOCOL_TELEGRAM,
  ABOUT,
  BLOG,
  PARTNERSHIPS,
  FAQ,
  USER_GUIDE,
  TERMS_HREF,
  PRIVACY_HREF,
} from "src/utils/constants";
import Tab from "src/components/design_system/tab";
import SocialRow from "src/components/talent/Show/SocialRow";
import Divider from "src/components/design_system/other/Divider";

const Footer = () => {
  const theme = useContext(ThemeContext);

  const profile = {
    github: TALENT_PROTOCOL_GITHUB,
    discord: TALENT_PROTOCOL_DISCORD,
    twitter: TALENT_PROTOCOL_TWITTER,
    telegram: TALENT_PROTOCOL_TELEGRAM,
  };

  return (
    <div className="footer-container">
      <Divider className="my-lg-7 mb-7 mt-0" />
      <div className="footer d-flex flex-column">
        <div className="d-flex flex-lg-row flex-column mb-0 mb-lg-7">
          <div className="col-lg-3">
            <a href="/" style={{ height: 30 }}>
              {theme.mode() == "light" ? (
                <LogoLight width={128} height={20} />
              ) : (
                <LogoDark width={128} height={20} />
              )}
            </a>
            <P2
              className="text-primary-03 mt-2"
              text="The web3 professional network for high-potential talent."
            />
          </div>
          <div className="col-lg-3"></div>
          <div className="col-lg-2 d-flex flex-column mt-5 mt-lg-0">
            <P2 className="text-black mb-2" bold text="Project" />
            <Tab
              href={ABOUT}
              text="About"
              type="white"
              className="mb-2"
              target="_blank"
            />
            <Tab
              href={BLOG}
              text="Blog"
              type="white"
              className="mb-2"
              target="_blank"
            />
            <Tab
              href={PARTNERSHIPS}
              text="Partnerships"
              type="white"
              className="mb-2"
              target="_blank"
            />
          </div>
          <div className="col-lg-2 d-flex flex-column mt-5 mt-lg-0">
            <P2 className="text-black mb-2" bold text="Help" />
            <Tab
              href={FAQ}
              text="FAQ"
              type="white"
              className="mb-2"
              target="_blank"
            />
            <Tab
              href={USER_GUIDE}
              text="User Guide"
              type="white"
              className="mb-2"
              target="_blank"
            />
            <Tab
              href={TERMS_HREF}
              text="Terms of Service"
              type="white"
              className="mb-2"
              target="_blank"
            />
            <Tab
              href={PRIVACY_HREF}
              text="Privacy Policy"
              type="white"
              className="mb-2"
              target="_blank"
            />
          </div>
          <div className="col-lg-2 d-flex flex-column mt-5 mt-lg-0">
            <P2 className="text-black mb-2" bold text="Socials" />
            <SocialRow className="ml-lg-0" profile={profile} />
          </div>
        </div>
        <div className="my-5 mt-lg-0 px-2 px-lg-0">
          <Divider />
          <div className="mt-4 d-flex flex-lg-row flex-column">
            <P2
              className="text-primary-03 mb-3 mb-lg-0 mr-4"
              text="Talent Protocol MTU © 2022"
            />
            <P2 className="text-primary-03 mr-4 d-lg-block d-none" text="|" />
            <a
              href="mailto:contact@talentprotocol.com"
              target="self"
              className="mr-4 text-primary-03"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default (props, _railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <Footer {...props} />
    </ThemeContainer>
  );
};
