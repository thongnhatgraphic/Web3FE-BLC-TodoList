import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 31337, 97]
});
const walletconnect = new WalletConnectConnector({
  rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  qrcode: true
});

const walletlink = new WalletLinkConnector({
  url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  appName: "Web3-Todo"
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};