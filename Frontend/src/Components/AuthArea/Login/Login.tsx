import "./Login.scss";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
// Models
import CredentialsModel from "../../../Models/CredentialsModel";
// Services
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";

function Login (): JSX.Element
{
  //credentials state
  const { register, handleSubmit } = useForm<CredentialsModel>();

  // Use navigate -> to redirect to user after login
  const navigate = useNavigate();

  // handle send form
  async function sendForm ( credentials: CredentialsModel )
  {
    try
    {
      await authService.login( credentials );
      notifyService.success( "Welcome Back!" );

      navigate( "/" );
    } catch ( err: any )
    {
      notifyService.error( err );
    }
  }

  return (
    <div className="Login">
      <form onSubmit={ handleSubmit( sendForm ) } autoComplete="true">
        <div className="form-header">
          <h3>Login</h3>
        </div>
        <div className="form-body">
          <label>Email address</label>
          <input
            { ...register( "email" ) }
            type="text"
            pattern="^[\w.]+@[\w.]+\.[\w.]+$"
            autoComplete="true"
            required
          ></input>

          <label>password</label>
          <input
            { ...register( "password" ) }
            type="password"
            minLength={ 4 }
            required
          ></input>

          <button type="submit"> Submit</button>

          <p>Don't have an account?</p>
          <NavLink to={ "/register" }> Register Here</NavLink>
        </div>
      </form>
    </div>
  );
}

export default Login;
