import React from "react";
import { Header } from "./styled"
import { Button } from "antd"
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";

import { connectors } from "../../utils/connector"
import market from "../../assets/logo/market.png"
import { useContract } from "../../hook/useContract";
import { login } from "../../features/auth/authSlice"

const HeaderCPN = () => {
    const {
        account,
        switchNetwork,
        library
    } = useContract();

    const dispatch = useDispatch();
    const {address} = useSelector(state=> state.auth)
    const {
        activate,
        deactivate
    } = useWeb3React();

    console.log("library", library);

    React.useEffect(() => {
        if ( account ) {
            dispatch(login({account}))
        }
    }, [account, dispatch])

    return <Header>
        <div className="logo">
            <img src={market} alt="martket place" />
        </div>

        <div className="block_wallet">
            { !address ? <Button
                onClick={async () => {
                    await switchNetwork();
                    await activate(connectors.injected);
                }}
            >
                connect wallet
            </Button>: "" }
            { address ? <Button onClick={ () => {
                deactivate()
                localStorage.removeItem("provider");
            }}>
                Loggout
            </Button> : ""}
        </div>
    </Header>
}
export default HeaderCPN;