import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 31337]
});
const walletconnect = new WalletConnectConnector({
  rpcUrl: `http://127.0.0.1:8545/`,
  qrcode: true
});

const walletlink = new WalletLinkConnector({
  url: `http://127.0.0.1:8545/`,
  appName: "web3-react-demo"
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};