import jwt_decode from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";

let baseURL = process.env.REACT_APP_BASE_URL;

// baseURL = "http://127.0.0.1:3000/"

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json"
  },
});


axiosInstance.interceptors.request.use(async (req) => {
  let userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  req.headers["Authorization"] = `Bearer ${userInfo?.access}`;
  const token = jwt_decode(userInfo?.access);
  const isExpired = dayjs.unix(token.exp).diff(dayjs()) < 1;
  if (!isExpired) return req;

  const config = {
    headers: {
      "Content-type": "application/json",
      "Refresh-attempt": true,
    },
  };

  const { data } = await axios.post(
    "/api/users/login/refresh/",
    {
      refresh: userInfo.refresh,
    },
    config
  );

  // data['username'] = userInfo.username

  localStorage.setItem("userInfo", JSON.stringify(data));
  req.headers.Authorization = `Bearer ${data.access}`;

  return req;
});

export default axiosInstance;
