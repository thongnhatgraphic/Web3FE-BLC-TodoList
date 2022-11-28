import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const LayoutLogin = ({ redirect }) => {
  const navigate = useNavigate();
  const { address } = useSelector(state => state.auth)
  
  React.useEffect(() => {
    if ( !address ) {
      navigate("login")
    } else {
      navigate("/")
    }
  }, [address, navigate])

  return (
    <>
        {
          address ? <Outlet /> : redirect
        }
    </>
  );
};

export default LayoutLogin;
