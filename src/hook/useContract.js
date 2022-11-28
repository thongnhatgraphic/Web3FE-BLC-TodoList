import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useDispatch } from "react-redux";
import Web3 from "web3";

import erc20 from "../abi/erc20.json";
import erc721 from "../abi/erc721.json";
import market from "../abi/market.json";
import { login, logout } from "../features/auth/authSlice.js";

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
        if ( contractErc20 ) {
            const balance = await contractErc20.methods
              .balanceOf(accounts[0])
              .call({
                from: accounts[0],
              });
              dispatch(
                login({
                  address: accounts[0],
                  balance,
                })
              );
        }
      }
    })();
  }, [dispatch, ethereum, initContract]);

  const connectWallet = async () => {
    if (!ethereum) return alert("Please install metamask");

    return ethereum
      .request({
        method: "wallet_requestPermissions",
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
            balance,
          })
        );
      })
      .catch((err) => {
        console.error("requestPermissions error", err);
      });
  };

  const logOut = () => {
    localStorage.removeItem(isConnectMetamask);
    dispatch(logout());
  };

  const initAllContract = React.useCallback(() => {
    (async () => {
      const web3Init = new Web3(
        "https://data-seed-prebsc-1-s1.binance.org:8545/"
      );

      const ContractERC20 = new web3Init.eth.Contract(
        erc20,
        process.env.REACT_APP_CONTRACT_ERC20
      );
      const ContractERC721 = new web3Init.eth.Contract(
        erc721,
        process.env.REACT_APP_CONTRACT_ERC721
      );

      const ContractMarketPlace = new web3Init.eth.Contract(
        market,
        process.env.REACT_APP_CONTRACT_MARKET
      )

      setInitContract({
        contractErc20: ContractERC20,
        contractErc721: ContractERC721,
        ContractMarketPlace: ContractMarketPlace,
        
      });
    })();
  }, []);

  const switchNetwork = React.useCallback(() => {
    const init = async () => {
      const web3 = new Web3(library.provider);
      const toHex = (chainId) => web3.utils.toHex(chainId);
      console.log("toHex", toHex);
      try {
        await library.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(97) }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await library.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: toHex(97),
                  chainName: "BSC",
                  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                  blockExplorerUrls: ["https://testnet.bscscan.com/"],
                },
              ],
            });
          } catch (addError) {
            throw addError;
          }
        }
      }
    };

    if (library?.provider) {
      init();
    } else return;
  }, [library]);

  const signature = async () => {
    const web3 = new Web3(library.provider);

    const [accountCurrent] = await web3.eth.getAccounts();
    const signature = await web3.eth.personal.sign(
      accountCurrent,
      accountCurrent
    );
    return signature;
  };



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

    signature,
    switchNetwork,
    checkWalletConnected,
    connectWallet,
    logOut,
  };
};
