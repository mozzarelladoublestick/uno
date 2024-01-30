import LoginButton from '../compontents/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';


const Login = () => {
    return (
        <>
        <LoginButton data-testid="login"/>
        </>
      )    
  };
  
  export default Login;