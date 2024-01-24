import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <h4> Sie sind erfolgreich authenticated wora! </h4>
        <Link to="/unoGame"> Weiter </Link>
        <LogoutButton />
      </div>
    );
  }


  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;