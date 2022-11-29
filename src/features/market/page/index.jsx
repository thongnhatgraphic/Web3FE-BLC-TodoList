import { Button, Row, Spin } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getListListing } from "../../market/marketSlice";
import { CardNft, MarketPlace } from "./styled";
import img1 from "../../../assets/imgNft/1.png";
import { useContract } from "../../../hook/useContract";
import { useNavigate } from "react-router-dom";
import { hideLoadding, openLoadding } from "../../assets/assetsSlice";
export default function Marketplace() {
  const { address } = useSelector((state) => state.auth);

  const { contractMarketPlace, contractErc20 } = useContract();

  const dispatch = useDispatch();
  const { listListing } = useSelector((state) => state.market);
  const { loadding } = useSelector((state) => state.assets);

  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      if (contractMarketPlace) {
        dispatch(openLoadding());
        const data = await contractMarketPlace.methods
          .getAllListingOfMarket()
          .call({
            from: address,
          });
        let array = data.map((item) => ({
          token_id: item["token_id"],
          status: item["status"],
          seller: item["seller"],
          price: +item["price"]/(10**18),
        }));
        console.log("3333");
        const arrayFilter = array.filter((item) => {
          return item.seller !== "0x0000000000000000000000000000000000000000";
        });
        dispatch(getListListing(arrayFilter));
        dispatch(hideLoadding());
      }
    })();
  }, [address, contractMarketPlace, dispatch]);

  const handleBuyItem = React.useCallback(
    ({ id, price }) => {
      console.log("price", price* 10**18);
      (async () => {
        if (contractMarketPlace && contractErc20 && address) {
          dispatch(openLoadding());
          try {
            await contractErc20.methods
              .approve(process.env.REACT_APP_CONTRACT_MARKET, `${+price*10**18}`)
              .send({
                from: address,
              });

            await contractMarketPlace.methods.buyItem(id).send({
              from: address,
            });

            const data = await contractMarketPlace.methods
              .getAllListingOfMarket()
              .call({
                from: address,
              });
            let array = data.map((item) => ({
              token_id: item["token_id"],
              status: item["status"],
              seller: item["seller"],
              price: +item["price"]/(10**18),
            }));
            const arrayFilter = array.filter((item) => {
              return (
                item.seller !== "0x0000000000000000000000000000000000000000"
              );
            });

            dispatch(getListListing(arrayFilter));

            dispatch(hideLoadding());
          } catch (error) {
            dispatch(hideLoadding());
          }
        }
      })();
    },
    [address, contractErc20, contractMarketPlace, dispatch]
  );

  const checkSell = React.useCallback((seller) => {
    
    return (() => {
      if ( seller.toLowerCase() === address.toLowerCase() ) {
        return true
      } else {
        return false
      }
    })()
  }, [address])

  const renderListListing = React.useMemo(() => {
    return listListing.map((item) => {
      return (
        <CardNft span={6} key={item.token_id}>
          <div className="card">
            <img src={img1} alt="" className="img_nft" />
            <div className="id">ID: #{item.token_id}</div>
            <div className="id">Price: {item.price}</div>
            <Button
              className="buy"
              onClick={() => {
                handleBuyItem({ id: item.token_id, price: item.price });
              }}

              disabled={checkSell(item.seller)}
            >
              Buy
            </Button>
          </div>
        </CardNft>
      );
    });
  }, [checkSell, handleBuyItem, listListing]);
  
  return (
    <Spin spinning={loadding}>
      <MarketPlace>
        <div
          style={{
            fontSize: "20px",
            color: "green",
            padding: "16px",
          }}
        >
          List Nft721 current listing
        </div>
        <button
          onClick={() => navigate("/assets")}
          style={{
            background: "transparent",
            border: "transparent",
            color: "blue",
            fontSize: "20px",
            padding: "0px 16px",
            cursor: "pointer",
          }}
        >
          Go to assets
        </button>
        <div className="container_list">
          <Row gutter={16}>{renderListListing}</Row>
        </div>
      </MarketPlace>
    </Spin>
  );
}
