import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/utilities/loader/loader.component";
import Message from "../../components/utilities/Message";
import { updateUserProfile } from "../../redux/actions/userActions";
import { USER_LOGOUT, USER_UPDATE_PROFILE_RESET } from "../../redux/constants/userConstants";

export const ResetPassword = ({ setOpen }) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const {
    loading,
    success,
    error: errorUpdatePassword,
  } = useSelector((state) => state.userUpdateProfile);
  
  useEffect(() => {
    if (success) {
      setMessage('Password successfully reset')
      setShowResetPassword(false)
      setPassword("");
      setPassword2("");
      setOldPassword("");
    }
    if (errorUpdatePassword === "Given token not valid for any token type") {
      dispatch({ type: USER_LOGOUT });
    }
    return () => {
      // setMessage("");
      // dispatch({type: USER_UPDATE_PROFILE_RESET})
    }
  }, [errorUpdatePassword, success, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          old_password: oldPassword,
          password: password,
          password2: password2,
        })
      );
      setMessage("");
    }
  };
  return (
    <div className="mx-auto max-w-xs mt-8">

      {loading && <Loader />}

      {message && <Message>{message}</Message>}

      {errorUpdatePassword && (
        <Message variant="danger">{errorUpdatePassword}</Message>
      )}
      <form>
        <div>
          <label
            htmlFor="oldpassword"
            className="block text-sm font-medium text-gray-700">
            Old password
          </label>
          <div className="mt-1">
            <input
              type="password"
              required
              id="oldpassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="newpassword"
            className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              required
              id="newpassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password2"
            className="block text-sm font-medium text-gray-700">
            Confirm new password
          </label>
          <div className="mt-1">
            <input
              type="password"
              required
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="block w-full p-1 bg-blue-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <button
            onClick={submitHandler}
            type="button"
            className="my-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 p-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-auto">
            Submit
          </button>
          <span
            onClick={() => setOpen(false)}
            className="font-medium cursor-pointer">
            Close
          </span>
        </div>
      </form>
    </div>
  );
};
