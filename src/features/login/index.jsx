import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const { address } = useSelector(state => state.auth)
    
    const navigate = useNavigate();

    React.useEffect(() => {
        if ( address ) {
            navigate("/");
        } else {
        }
    }, [address, navigate])

    return <div style={{
        display: "flex",
        justifyContent: "center",
        height: "300px",
        width: "100%",
        alignItems: "center"
    }}>
        Hello Welcome to MarketPlace
    </div>
}

export default LoginPage;