import { Col } from "antd";
import styled from "styled-components";

export const MarketPlace = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  .container_list {
    padding: 20px;
  }
`

export const CardNft = styled(Col)`
  .card {
    border-radius: 10px;
    border: 2px solid rgba(0,0,0,.7);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .img_nft {
      width: 100%;
      max-width: 140px;
      border-radius: 10px;
      height: 140px;
      object-fit: contain;
      display: flex;
      justify-content: center;
    }
    .id {
      text-align: center;
      margin: 10px;
    }
    .buy {
      width: 100%;
      background-color: yellow;
      border-color: yellow;
      font-weight: 500;
    }
  }

`