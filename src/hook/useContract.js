import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React from "react";
import { useDispatch } from "react-redux";
import Web3 from "web3";

import erc20 from "../abi/erc20.json";
import erc721 from "../abi/erc721.json";
import market from "../abi/market.json";
import { login, logout } from "../features/auth/authSlice.js";
import { n4 } from "../utils/formatCurrency";

const isConnectMetamask = "isConnectMetamask";

export const useContract = () => {
  const { ethereum } = window;

  const [initContract, setInitContract] = React.useState({
    contractErc20: null,
    contractErc721: null,
    contractMarketPlace: null,
  });

  const { library, chainId, account } = useWeb3React();

  const dispatch = useDispatch();

  const checkWalletConnected = React.useCallback(() => {
    (async () => {
      if (!ethereum) return alert("Please install metamask");

      const { contractErc20 } = initContract;
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts?.length) {
        if (contractErc20) {
          const balance = await contractErc20.methods
            .balanceOf(accounts[0])
            .call({
              from: accounts[0],
            });
          dispatch(
            login({
              address: accounts[0],
              balance: +balance/10**18,
            })
          );
        }
      }
    })();
  }, [dispatch, ethereum, initContract]);

  const switchNetwork = React.useCallback(() => {
    const init = async () => {
      const web3 = new Web3(ethereum);
      const chaindCurrent = await web3.eth.getChainId()
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
  }, [ethereum]);
  
  const connectWallet = async () => {
    if (!ethereum) return alert("Please install metamask");

    ethereum
      .request({
        method: "wallet_requestPermissions",
        // eth_requestAccounts
        params: [{ eth_accounts: {} }],
      })
      .then(async (account) => {
        localStorage.setItem(isConnectMetamask, true);
        
        const { contractErc20 } = initContract;
        const balance = await contractErc20.methods
          .balanceOf(account[0].caveats[0].value[0])
          .call({
            from: account[0].caveats[0].value[0],
          });
        
        dispatch(
          login({
            address: account[0].caveats[0].value[0],
            balance: +balance/10**18,
          })
        );
        
      })
      .catch((err) => {
        console.error("requestPermissions ---error", err);  
      })
      
  };

  const logOut = () => {
    localStorage.removeItem(isConnectMetamask);
    dispatch(logout());
  };

  

  const initAllContract = React.useCallback(() => {
    (async () => {
      const web3 = new Web3(ethereum);
      ethereum.enable();
      const ContractERC20 = new web3.eth.Contract(
        erc20,
        process.env.REACT_APP_CONTRACT_ERC20
      );
      const ContractERC721 = new web3.eth.Contract(
        erc721,
        process.env.REACT_APP_CONTRACT_ERC721
      );

      const ContractMarketPlace = new web3.eth.Contract(
        market,
        process.env.REACT_APP_CONTRACT_MARKET
      );

      setInitContract({
        contractErc20: ContractERC20,
        contractErc721: ContractERC721,
        contractMarketPlace: ContractMarketPlace,
      });
      
    })();
  }, [ethereum]);

  const signature = async () => {
    const web3 = new Web3(library.provider);

    const [accountCurrent] = await web3.eth.getAccounts();
    const signature = await web3.eth.personal.sign(
      accountCurrent,
      accountCurrent
    );
    return signature;
  };

  const reConnectAndInit=() => {
    initAllContract();
  }

  React.useEffect(() => {
    initAllContract();
  }, [initAllContract]);

  React.useEffect(() => {
    if (localStorage.getItem(isConnectMetamask)) {
      checkWalletConnected();
    }
  }, [checkWalletConnected]);

  return {
    contractErc20: initContract.contractErc20,
    contractErc721: initContract.contractErc721,
    contractMarketPlace: initContract.contractMarketPlace,
    library,
    chainId,
    account,

    reConnectAndInit,
    signature,
    switchNetwork,
    checkWalletConnected,
    connectWallet,
    logOut,
  };
};
