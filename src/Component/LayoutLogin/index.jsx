import React  from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useContract } from "../../hook/useContract";

const LayoutLogged = ({ redirect }) => {
  const navigate = useNavigate();
  const { isConnect } = useSelector(state => state.auth);

  const switchNetwork = React.useCallback(() => {
    const init = async () => {
      const { ethereum } = window
      const web3 = new Web3(ethereum);
      const chaindCurrent = await web3.eth.getId()
      console.log("chaindCurrent", chaindCurrent);
      const chaindCurrentTohex = web3.utils.toHex(chaindCurrent);

      const toHex = async(chainId) =>  {
        return web3.utils.toHex(chainId)
      };
      const chaind = await toHex(97);
      console.log("chaindCurrentTohex", chaindCurrentTohex, chaind);
      if ( chaindCurrentTohex !== chaind) {
        try { 
          console.log("ehrerre");
          return await ethereum.request({
            method: 'wallet_switchEthereumChain',
              params: [{ chainId: chaind }],
            });
        } catch (error) {

        }

      }

      // try {
      //   console.log("rrr");
      //   if ( chaindCurrentTohex !== chaind) {

      //     console.log("1111");
      //     await ethereum.request({
      //       method: "wallet_switchEthereumChain",
      //       params: [{ chainId: chaind }],
      //     });
      //     console.log("chained");
      //     return true
      //   } else if ( chaindCurrentTohex === chaind) {
      //     console.log("no change");
      //     return true
      //   }
      // } catch (switchError) {
      //   if (switchError.code === 4902) {
      //     try {
      //       await ethereum.request({
      //         method: "wallet_addEthereumChain",
      //         params: [
      //           {
      //             chainId: chaind,
      //             chainName: "BSC",
      //             rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      //             blockExplorerUrls: ["https://testnet.bscscan.com/"],
      //           },
      //         ],
      //       });
      //       return true
      //     } catch (addError) {
      //       console.log("hrer");
      //       throw addError;
      //     }
      //   }
      // }
    };

    init();
  }, []);

  // React.useEffect(() => {
    
  //   switchNetwork();
  // }, [switchNetwork])

  React.useEffect(() => {
    const storage = !!localStorage.getItem("isConnectMetamask");
    
    if ( !storage && !isConnect) {
      navigate("login")
    }
  }, [isConnect, navigate])

  
  return (
    <>
        {
          isConnect ? <Outlet /> : redirect
        }
    </>
  );
};

export default LayoutLogged;
