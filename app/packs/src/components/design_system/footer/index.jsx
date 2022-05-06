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
    <div className="footer mt-lg-7 d-flex flex-column justify-content-between">
      <div className="d-flex">
        <div className="col-3">
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
        <div className="col-3"></div>
        <div className="col-2 d-flex flex-column">
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
        <div className="col-2 d-flex flex-column">
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
        <div className="col-2 d-flex flex-column">
          <P2 className="text-black mb-2" bold text="Socials" />
          <SocialRow className="ml-lg-0" profile={profile} />
        </div>
      </div>
      <div>
        <Divider />
        <div className="mt-4 d-flex">
          <P2
            className="text-primary-03 mr-4"
            text="Talent Protocol MTU © 2022"
          />
          <P2 className="text-primary-03 mr-4" text="|" />
          <a
            href="mailto: contact@talentprotocol.com"
            target="self"
            className="mr-4 text-primary-03"
          >
            contact@talentprotocol.com
          </a>
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
