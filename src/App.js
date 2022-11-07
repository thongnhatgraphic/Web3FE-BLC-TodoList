import React, { useState } from 'react';
import './App.css';

import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connector";

import abiTodo from "./abi/todolist.json"

import Web3 from "web3"

function App() {
  console.log(process.env.CONTRACT_TODO);
  const {
    library,
    chainId,
    account,
    activate,
    deactivate
  } = useWeb3React();
  
  const [signature, setSignature] = useState("");

  const [ inputAddTodo, setInputAddTodo] = React.useState("");

  const [ inputEditTodo, setInputEditTodo] = React.useState("")

  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  
  const [ array, setArray ] = useState([])

  const switchNetwork  = React.useCallback(() => {
    const init = async () => {
    const web3 = new Web3(library.provider);
    console.log("we3", web3);
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

  const getTodoListOfAccount = React.useCallback(async() => {
    const web3 = new Web3(library.provider);

    const Contract = new web3.eth.Contract(abiTodo, "0xB0A2D61Bbf572352F44580190b60C69425789F80");

    const arrayRes = await Contract.methods.getListTodoOfAddress().call({
      from: account
    })
    
    const cl = []
    arrayRes.forEach(item => {
      if ( item.length && item.owner !== "0x0000000000000000000000000000000000000000") {
        
        cl.push({
          _idTodo: item._idTodo,
          _desription: item._desription,
          status: item.status,
          owner: item.owner
        })
      }
    })
    setArray(cl);
  }, [account, library])

  // console.log("signature", "34", signedMessage);`
  const [WEB3, SETWEB3] = useState(null);
  console.log("WEB3", WEB3);
  React.useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) {
      activate(connectors[provider])
      // switchNetwork()
     };
     SETWEB3(connectors[provider])
  }, [activate,]);

  // React.useEffect(() => {
  //   if ( library && library.provider) {
  //     getTodoListOfAccount();
  //   } return;
      
  // },[getTodoListOfAccount, library])

  React.useEffect(() => {
    // const web3 = new Web3(library.provider);

    if ( account && chainId !== 97) {
      console.log("------------");
      const changeNetWorkAndInit = async () => {
        await switchNetwork();
        await getTodoListOfAccount();

      }
      changeNetWorkAndInit();
    }
    
  },[account, chainId, getTodoListOfAccount, library, switchNetwork])

  console.log("chaiId", chainId);
  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };
  
  
  const addTodoItem = async () => {
    
    const web3 = new Web3(library.provider);
    const Contract = new web3.eth.Contract(abiTodo, "0xB0A2D61Bbf572352F44580190b60C69425789F80");
    const gas = await web3.eth.getGasPrice();
    await Contract.methods.addTodoItem(inputAddTodo).send({
      from: account,
      gasPrice: gas
    })

    await getTodoListOfAccount();
  }


  const editAnItem = async(id, _desription) => {
    // console.log("-------", id, typeof(id), Number(id));
    const web3 = new Web3(library.provider);
    const Contract= new web3.eth.Contract(abiTodo, "0xB0A2D61Bbf572352F44580190b60C69425789F80");

    await Contract.methods.editTodoItem(Number(id), _desription, true).send({
      from: account
    })
    await getTodoListOfAccount();
  }

  const deleteAnItem = async(id) => {
    const web3 = new Web3(library.provider);
    const Contract= new web3.eth.Contract(abiTodo, "0xB0A2D61Bbf572352F44580190b60C69425789F80");
    await Contract.methods.removeTodoItem(Number(id)).send({
      from: account
    })
    await getTodoListOfAccount();
    
  }

 
console.log("arra", array);
  
  return (
    <div className="App">
      <div>account is logging: {account}</div>
      <button onClick={async() => {
        const web3 = new Web3(library.provider);

        const [accountCurrent] = await web3.eth.getAccounts();
        const signature = await web3.eth.personal.sign(accountCurrent, accountCurrent);
        setSignedMessage(signature)
        
      }}>Send Signature to BE</button>
      <br/>
      <button onClick={switchNetwork}>Switch network</button>
      <br/>
      <button
        onClick={async() => {
          activate(connectors.injected);
          // setProvider("injected");
            // switchNetwork();

          // await activate(connectors.injected);
          // SETWEB3()
          
        }}
      >Connect</button>

      <button onClick={async () => {
        await deactivate();
        setArray([])
      }}>log out</button>
<br/><br/><br/><br/>
      <div>
        <input value={inputAddTodo} onChange={(e) => {setInputAddTodo(e.target.value)}}/>
        <button onClick={addTodoItem}>AddtoDo</button>
      </div>
      <br/><br/><br/><br/>
      {/* <button onClick={()=>{
        getTodoListOfAccount()
      }}>Fetch data</button> */}

      <input value={inputEditTodo} onChange={(e) => setInputEditTodo(e.target.value)} placeholder="edit item"/>
      {/* <button onClick={editAnItem}>edit 1 item</button> */}

      <br/><br/><br/><br/>
      <div>
      {
        array.map(item => {
          // _idTodo: item._idTodo,
          // _desription: item._desription,
          // status: item.status,
          // owner: item.owner
          return <div key={item._idTodo} style={{ display: 'flex'}}>
            <div> {item._desription}</div>
            <div>--------{ item.status ? "Finish" : "Unfinish" } </div>
            <button onClick={() => {editAnItem(item._idTodo, inputEditTodo)}}> edit</button>
            <button onClick={() => { deleteAnItem(item._idTodo) }}>Delete</button>
          </div>
        })
      }
      </div>
    </div>
  );
}

export default App;
