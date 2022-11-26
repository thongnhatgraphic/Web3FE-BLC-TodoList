import { useWeb3React } from "@web3-react/core";
import React from "react";
import Web3 from "web3";

import erc20 from "../abi/erc20.json"
import erc721 from "../abi/erc721.json"

export const useContract = () => {
    const {
        library,
        chainId,
        account,
    } = useWeb3React();

    const [ initContract, setInitContract ] = React.useState({
        contractErc20: null,
        contractErc721: null,
        contractMarketPlace: null,
    });
    
    const initAllContract = React.useCallback(() => {
        (async () => {
            if ( !library ) {
                return;
            }
            const web3 = new Web3(library.provider);
            const ContractERC20 = new web3.eth.Contract(erc20, process.env.REACT_APP_CONTRACT_ERC20);
            const ContractERC721 = new web3.eth.Contract(erc721, process.env.REACT_APP_CONTRACT_ERC721);
    
            setInitContract({
                ContractERC20,
                ContractERC721
            })
        })()
    }, [library])

    const switchNetwork = React.useCallback(() => {
        const init = async () => {
            const web3 = new Web3(library.provider);
            const toHex = (chainId) => web3.utils.toHex(chainId)
            try {
                await library.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: toHex(97) }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
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
        }

        init();
    }, [library]);


    const signature = async() => {
        const web3 = new Web3(library.provider);

        const [accountCurrent] = await web3.eth.getAccounts();
        const signature = await web3.eth.personal.sign(accountCurrent, accountCurrent);
        return signature;
      }

    React.useEffect(() => {
        initAllContract();
    }, [initAllContract])

    return {
        contractErc20: initContract.contractErc20,
        contractErc721: initContract.contractErc721,
        contractMarketPlace: initContract.contractMarketPlace,
        library,
        chainId,
        account,

        signature,
        switchNetwork
    }
}

