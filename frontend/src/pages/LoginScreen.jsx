import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/utilities/loader/loader.component";
import Message from "../components/utilities/Message";
import { login, loginWithOTP } from "../redux/actions/userActions";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [needOTP, setNeedOTP] = useState(false);
  const [OTP, setOTP] = useState("");

  const dispatch = useDispatch();

  let navigate = useNavigate();

  let redirect = useLocation().search.split("=")[1];
  if (!redirect) redirect = "/";

  let { error, loading, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }

    if (error && error[0].includes("We were not able to verify your email")) {
      setNeedOTP(true);
    }
    return () => {
      error = "";
    };
  }, [navigate, userInfo, redirect, error]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  const submitOTP = (e) => {
    e.preventDefault();
    dispatch(loginWithOTP(OTP, username, password));
  };
  return (
    <>
      {error && <Message>{error}</Message>}

      {loading && <Loader />}

      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {!needOTP ? (
            <>
              <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="username"
                      type="username"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Please enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign in
                  </button>
                </div>
              </form>

              <div className="flex gap-5 justify-center text-center">
                New to our site?
                <Link
                  className="font-lg font-semibold hover:scale-[1.05]"
                  to={
                    redirect ? `/register?redirect=${redirect}` : "/register"
                  }>
                  {" "}
                  Register!
                </Link>
              </div>
            </>
          ) : (
            <div className="loginscreen__validateeamil">
              <h5 className="text-center">
                An <b>one-time password</b> was sent to the email associated
                with your account. Please enter it here to complete
                registration.
              </h5>

              <form onSubmit={submitOTP}>
                <div className="input-control">
                  <input
                    className="my-5 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    id="password"
                    required
                    type="name"
                    placeholder="OTP from your email"
                    value={OTP}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                </div>
                <button 
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                type="submit" 
                variant="primary"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
