import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import {
  USER_LOGOUT,
  USER_UPDATE_PROFILE_RESET,
} from "../../redux/constants/userConstants";
import { ProfileOrders } from "./ProfileOrders";
import { ProfileUserInfo } from "./ProfileUserInfo";
import { ResetPassword } from "./ResetPassword";
import { ProfileMessages } from "./ProfileMessages";
import { HomeIcon, InboxIcon, UsersIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileScreen() {
  const [currentTab, setCurrentTab] = useState("orders");
  const [navigation, setNavigation] = useState([
    { name: "Orders", value: "orders", icon: InboxIcon },
    { name: "Account", value: "account", icon: HomeIcon },
    { name: "Messages", value: "messages", icon: UsersIcon },
  ]);

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { error, loading, user } = useSelector((state) => state.userDetails);
  const { userInfo } = useSelector((state) => state.userLogin);

  // If user is not already logged in, return user to previous page
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!user && !user.username) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(getUserDetails());
    }
    if (error === "Given token not valid for any token type") {
      dispatch({ type: USER_LOGOUT });
    }
  }, [navigate, userInfo, dispatch, user, error]);

  return (
    <div className="p-2 rounded-lg">

      <nav className="mt-5 p-2 rounded-sm items-center flex flex-row-reverse flex-wrap gap-2 border-b-2 border-gray sm:mx-8">
        <>
          <div className="ml-auto flex flex-row gap-1">
            {navigation.map((item) => (
              <div
                key={item.value}
                onClick={() => setCurrentTab(item.value)}
                className={classNames(
                  item.value === currentTab
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-700 hover:text-white bg-white",
                  "group flex text-sm items-center px-2 py-1 font-medium rounded-sm cursor-pointer"
                )}>
                <item.icon
                  className={classNames(
                    item.value === currentTab
                      ? "text-gray-300"
                      : "text-gray-400 group-hover:text-gray-300",
                    "mr-4 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </div>
            ))}
          </div>
          <div className=' flex flex-row items-center gap-4'>
            <span className='text-xl font-semibold'>Welcome!</span>
            <img src={user.avatarUrl} className='border-full aspect-square rounded-full object-cover w-10 h-10' />
          </div>
        </>
      </nav>

      {
        {
          orders: <ProfileOrders />,
          account: <ProfileUserInfo />,
          messages: <ProfileMessages />,
          resetpassword: <ResetPassword />,
        }[currentTab]
      }


    </div>


  );
}
