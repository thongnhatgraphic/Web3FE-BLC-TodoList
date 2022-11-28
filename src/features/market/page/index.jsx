import { Button, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";

import { CardNft, MarketPlace } from "./styled";
import img1 from "../../../assets/imgNft/1.png";
import { useContract } from "../../../hook/useContract";
export default function Marketplace() {
  const { address } = useSelector(state => state.auth);

  const { contractErc721 } = useContract();
  
  const listtingNft = async (id) => {
    console.log("---", contractErc721);
    await contractErc721.methods.approve(process.env.REACT_APP_CONTRACT_MARKET, id).send({
      account: address
    })

  }

  return (
    <MarketPlace>
      <div>List Nft721 current listing</div>
      <div className="container_list">
        <Row gutter={16}>
        <CardNft span={6}>
          <div className="card">
            <img src={img1} alt="" className="img_nft"/>
            <div className="id">ID: #122</div>
            <Button className="buy"
              onClick={() => {listtingNft(1)}}
            >Buy</Button>
          </div>
        </CardNft>
        </Row>
      </div>
    </MarketPlace>
  );
}

