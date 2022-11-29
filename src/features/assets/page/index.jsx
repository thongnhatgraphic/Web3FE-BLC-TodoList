import { Button, Input, Row, Spin } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getListAssets, hideLoadding, openLoadding } from "../../assets/assetsSlice"
import { CardNft, MarketPlace } from "./styled";
import img1 from "../../../assets/imgNft/1.png";
import { useContract } from "../../../hook/useContract";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default function Assets() {

  const { address } = useSelector((state) => state.auth);
  
  const { contractErc721, contractMarketPlace } = useContract();

  const dispatch= useDispatch();

  const { listAssets, loadding } = useSelector(state => state.assets);

  const navigate = useNavigate();

  const [value, setValue] = React.useState("")
  const onChange = (e) => {
    setValue(e.target.value);
  }

  const listtingNft = React.useCallback((id) => {
    if ( contractErc721 && contractMarketPlace && address) {
      (async () => {
        try {
          dispatch(openLoadding())
          await contractErc721.methods.approve(process.env.REACT_APP_CONTRACT_MARKET, id).send({
            from: address
          })
          console.log("---->", (ethers.utils.parseUnits(value, 18).toString()));
    
          const response = await contractMarketPlace.methods.listtingItem(id, ethers.utils.parseUnits(value, 18).toString()).send({
            from: address
          })
          console.log("response", response);

          const fetch = await contractErc721.methods.tokensOfOwner(address).call({
            from: address
          });
  
          dispatch(getListAssets(fetch))
          dispatch(hideLoadding())
        } catch (error) {
          dispatch(hideLoadding())
          console.log("eror", error);
        }
      })();
    }
  }, [address, contractErc721, contractMarketPlace, dispatch, value]);
  
  React.useEffect(() => {
    (async () => {
      if ( contractErc721 && address) {
        dispatch(openLoadding());
        const data = await contractErc721.methods.tokensOfOwner(address).call({
          from: address
        });

        dispatch(getListAssets(data))
        dispatch(hideLoadding());
      }
    })(); 
  }, [address, contractErc721, dispatch])
  
  const renderListListing = React.useMemo(() => {
    return listAssets.map((item) => {
      return <CardNft span={6} key={item}>
      <div className="card">
        <img src={img1} alt="" className="img_nft" />
        <div className="id">ID: #{item}</div>
        <Button
          className="buy"
          onClick={() => {
            listtingNft(item);
          }}
        >
          Listing
        </Button>
      </div>
    </CardNft>
    })
  }, [listAssets, listtingNft])

  
  return (
    <Spin spinning={loadding}>
      <MarketPlace>
        <div style={{
          fontSize:"20px",
          color: "green",
          padding: "16px"
        }}>List Nft721 Assets</div>
        
        <button onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "transparent",
            color: "blue",
            fontSize: "20px",
            padding: "0px 16px",
            cursor: "pointer"
          }}
        >Go to market</button>
        <div className="container_list">
          <Row gutter={16}>
            {renderListListing}
          </Row>
        </div>

        <Input value={value} onChange={onChange} placeholder="type amount"/>
      </MarketPlace>
    </Spin>
  );
}
