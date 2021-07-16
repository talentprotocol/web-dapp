import React, { useState } from 'react'

const Welcome = ({ changeStep, changeEmail, email }) => {
  const [localEmail, setEmail] = useState(email)

  const validEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(localEmail).toLowerCase());
  }

  const submitWelcomeForm = (e) => {
    e.preventDefault()
    if (localEmail != "" && validEmail()){
      changeEmail(localEmail)
      changeStep(2)
    }
  }

  const requestAccess = (e) => {
    e.preventDefault()
    if(localEmail != "" && validEmail()){
      changeEmail(localEmail)
      changeStep(5)
    }
  }

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 1 of 4</h6>
      <h1>Welcome!</h1>
      <p>We're currently in close beta. Enter your email to validate you have access to the platform or request access.</p>
      <p><small>If you already have an account <a href="/sign_in">sign in</a>.</small></p>
      <form onSubmit={submitWelcomeForm} className="d-flex flex-column">
        <div className="form-group">
          <label htmlFor="inputEmail"><small>Email</small></label>
          <input type="email"
            className="form-control"
            id="inputEmail"
            aria-describedby="emailHelp"
            value={localEmail}
            onChange={(e) => setEmail(e.target.value)}/>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="align-self-end">
          <button type="button" disabled={!validEmail()} onClick={(e) => requestAccess(e)} className="ml-auto btn btn-light talent-button">Request Access</button>
          <button type="submit" disabled={!validEmail()} className="ml-2 btn btn-primary talent-button">Validate</button>
        </div>
      </form>
    </div>
  )
}

export default Welcome