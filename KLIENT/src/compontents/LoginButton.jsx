import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <Profile/>
        <h4> Sie wurden erfolgreich authentifiziert! </h4>
        <Link className="login-button" to="/unoGame"> Weiter </Link>
        <br />
      </div>
    );
  }


  return <button className='login-button' onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;