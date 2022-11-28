import React from "react";
import web3  from "web3";

const isConnectMetamask = "isConnectMetamask"

const WrapperApp = ({ children }) => {

  const [accountLoggin, setAccountLoggin] = React.useState(null);
  const [chainId, setChainId] = React.useState(null);
  // const [accountLoggin, setAccountLoggin] = React.useState(null);

  const checkWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) return alert("Please install metamask");

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if(accounts?.length){
        setAccountLoggin(accounts[0]);
    }
  }

  const connectWallet = () => {
    const { ethereum } = window;

    if (!ethereum) return alert("Please install metamask");

    return ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{eth_accounts:{}}]
    }).then((account)=>{
        setAccountLoggin(account[0].caveats[0].value[0]);
        localStorage.setItem(isConnectMetamask, true);
    }).catch(err=>{
        console.error('requestPermissions error', err);
    });
  }

  // const disconnectWallet = () => {
  //   localStorage.removeItem(isConnectMetamask);
  //   history.go(0);
  // }

  // const getChainId = () => {
  //   const { ethereum } = window;

  //   if (!ethereum) return;
  //   web3.eth.getChainId().then(res => {
  //       const newChainId = web3.utils.toHex(res);
  //       if (chainId && chainId !== newChainId) history.go(0);
  //       else setChainId(web3.utils.toHex(res));
  //   });
  // } 

  React.useEffect(()=> {

    checkWalletConnected();

  }, [])


  return <>
    { children }
  </>
}

export default WrapperApp;