import React from "react"
import LogoImage from "images/logo-light.svg"
import SmallLogo from "images/talent-logo-small.svg"

const Logo = () => (
  <>
    <img className="d-none d-md-block" src={LogoImage} height="18" alt="Talent Protocol" />
    <img className="d-block d-md-none" src={SmallLogo} height="18" alt="Talent Protocol" />
  </>
)

export default Logo