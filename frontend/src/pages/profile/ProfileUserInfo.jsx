import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../redux/actions/userActions";
import { ResetPassword } from "./ResetPassword";

export const ProfileUserInfo = () => {
  const { error, loading, user } = useSelector((state) => state.userDetails);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!user.username) {
      dispatch(getUserDetails())
    }
  }, [])
  return (
    <>
      <div className="flex flex-col gap-2 xs:flex-row justify-between flex-wrap mt-8 xs:mx-8 ">
        <div className="ml-6 xs:ml-0 grid xs:grid-cols-2 xs:gap-x-5 w-max">
          <span className="font-medium text-gray-500">
            Username:
          </span>
          <span>{user && user.username}</span>
          <span className="font-medium text-gray-500  mt-4 xs:mt-0">Email:</span>
          <span>{user && user.email}</span>
        </div>

        {!showResetPassword && (
          <button
            type="button"
            onClick={() => setShowResetPassword(true)}
            className="mt-8 mx-4 flex items-center justify-center rounded-md border border-transparent bg-blue-600 p-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ">
            Reset Password
          </button>
        )}
      </div>
      {showResetPassword && <ResetPassword setOpen={setShowResetPassword} />}
    </>
  );
};
