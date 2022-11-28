import { Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Header } from "./styled";

import { useNavigate } from "react-router-dom";
import market from "../../assets/logo/market.png";
import { useContract } from "../../hook/useContract";
import { truncateAddress } from "../../utils/formatAddress"

const HeaderCPN = () => {
  const navigate = useNavigate();

  const { address, balance } = useSelector((state) => state.auth);

  const { connectWallet, logOut } = useContract();

  return (
    <Header>
      <div className="logo">
        <img src={market} alt="martket place" />
      </div>

      <div className="block_wallet">
        {!address ? (
          <Button
            onClick={async () => {
              connectWallet();
            }}
          >
            connect wallet
          </Button>
        ) : (
          ""
        )}
        {address ? (
          <>
            <div className="block_money">
                <div className="address">
                    {truncateAddress(address)}
                </div>
                <div className="balance">
                    EUC: {balance}
                </div>
            </div>
            <Button
              onClick={() => {
                logOut();
              }}
            >
              Loggout
            </Button>
          </>
        ) : (
          ""
        )}
      </div>
    </Header>
  );
};
export default HeaderCPN;
