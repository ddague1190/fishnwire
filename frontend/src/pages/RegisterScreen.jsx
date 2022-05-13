import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/utilities/loader/loader.component";
import Message from "../components/utilities/Message";
import { register, sendOTP } from "../redux/actions/userActions";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "../utils/useForm";

export default function RegisterScreen() {
  const [formData, setFormData] = useForm({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    OTP: "",
  });

  const [message, setMessage] = useState("");

  const { userName, email, password, confirmPassword, OTP } = formData;

  const dispatch = useDispatch();

  let navigate = useNavigate();

  let redirect = useLocation().search.split("=")[1];

  if (!redirect) redirect = "/";

  const userRegister = useSelector((state) => state.userRegister);

  let { error, loading, OTPready, userInfo } = userRegister;

  // If user is already logged in, return user to previous page
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    return () => {
      error = "";
    };
  }, [navigate, userInfo, redirect, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(userName, email, password));
      setMessage("");
    }
  };

  const submitOTP = (e) => {
    e.preventDefault();
    dispatch(sendOTP(OTP, userName, password));
  };
  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
          </div>
          {error && <Message>{error}</Message>}
          {message && <Message>{message}</Message>}
          {loading && <Loader />}
          {!OTPready ? (
            <form className="mt-8 space-y-6" onSubmit={submitHandler}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="userName"
                    type="text"
                    required
                    value={userName}
                    onChange={setFormData}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Please pick a username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={setFormData}
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Your email address"
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
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={setFormData}
                  />
                </div>

                <div>
                  <label htmlFor="passwordconfirm" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="passwordconfirm"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Please confirm your password"
                    value={formData.confirmPassword}
                    onChange={setFormData}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Register
                </button>
              </div>
              <div className="flex gap-5 items-center">
                Already have an Account?
                <Link
                  className="font-semibold text-lg hover:scale-[1.05]"
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                  {" "}
                  Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-6 ">
              <h1 className="text-center font-bold">
                Please check your email for a one-time password
              </h1>
              <form onSubmit={submitOTP}>
                <div>
                  <input
                    className="appearance-none mb-5 rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    id="OTP"
                    required
                    type="name"
                    name="OTP"
                    placeholder="OTP from your email"
                    value={formData.OTP}
                    onChange={setFormData}
                  />
                  <label htmlFor="OTP" className="sr-only">
                    Enter OTP
                  </label>
                </div>
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  type="submit"
                  variant="primary">
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
