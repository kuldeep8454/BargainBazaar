import React, { useEffect, useState } from "react";
import { Avatar, Badge, message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { Navigate, useNavigate } from "react-router-dom";
import Logo from "./Logo.png";
import { PiListPlusFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";
import Home from "../pages/Home";
import Notifications from "./Notifications";
import { GetAllNotifications, ReadAllNotifications } from "../apicalls/notifications";

function ProtectedPage({ children }) {
  const { user } = useSelector((state) => state.users)

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      message.error(response.message);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      navigate("/login");
    }
    validateToken();
  }, []);



  return (
    user && (
      <div>
        {/* {header} */}
        <div className="flex justify-between items-center bg-primary p-5">
          <h1
            className="text-2xl text-white text-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              className="h-20 w-full rounded-full shadow-lg shadow-yellow-500/50  relative"
              src={Logo}
              alt=""
            />
            <span className="ml-2 mb-5 text-2xl absolute " onClick={() => navigate('/')}>BargainBazaar</span>
          </h1>
          <div className="flex items-center justify-between">
            <span className="bg-white py-2 px-5 rounded flex gap-1 items-center" >Add Product
            <PiListPlusFill
            className="mx-auto cursor-pointer font-bold"
            strokeWidth={1.5} 
            // style={{ color: "#f5f5f5" }}
            onClick={()=> navigate("/profile")}
          /></span>
          </div>
          <div className="bg-white py-2 px-5 rounded flex gap-1 items-center">
            <i className="ri-shield-user-line cursor-pointer"
              onClick={() => navigate("/profile")}
            ></i>
            <span
              className="underline cursor-pointer uppercase"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>
            <Badge
              className="cursor-pointer"
              count={
                notifications.filter((notification) => !notification.read).length
              }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
            >
              <Avatar
                shape="circle"
                size="small"
                icon={<i className="ri-notification-3-line"></i>}
              />
            </Badge>
            <i
              className="ri-logout-circle-r-line ml-10"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        {/* body */}
        <div className="p-5">{children}</div>
        {<Notifications
          notifications={notifications}
          reloadNotifications={getNotifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />}
      </div>
    )
  );
}

export default ProtectedPage;
