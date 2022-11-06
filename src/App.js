import React, { useState } from 'react';
import './App.css';

import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connector";

import abiTodo from "./abi/todolist.json"

import Web3 from "web3"

function App() {

  const {
    library,
    chainId,
    account,
    activate
  } = useWeb3React();

  const [signature, setSignature] = useState("");

  const [ inputAddTodo, setInputAddTodo] = React.useState("");

  const [ inputEditTodo, setInputEditTodo] = React.useState("")

  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  
  const [ array, setArray ] = useState([])

  const getTodoListOfAccount = React.useCallback(async() => {
    const web3 = new Web3(library.provider);

    const Contract = new web3.eth.Contract(abiTodo, "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    const arrayRes = await Contract.methods.getListTodoOfAddress().call({
      from: account
    })
    
    const cl = []
    arrayRes.forEach(item => {
      if ( item.length) {
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
  React.useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) {
      activate(connectors[provider])
     };
  }, []);

  React.useEffect(() => {
    if ( library && library.provider) {
      getTodoListOfAccount();
    } return;
      
  },[getTodoListOfAccount, library])

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  
  const addTodoItem = async () => {
    
    const web3 = new Web3(library.provider);
    const Contract = new web3.eth.Contract(abiTodo, "0x5FbDB2315678afecb367f032d93F642f64180aa3");
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
    const Contract= new web3.eth.Contract(abiTodo, "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    await Contract.methods.editTodoItem(Number(id), _desription, true).send({
      from: account
    })
    await getTodoListOfAccount();
  }

  
  return (
    <div className="App">
      <button
        onClick={() => {
          activate(connectors.injected);
          setProvider("injected");
        }}
      >Connect</button>
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
          </div>
        })
      }
      </div>
    </div>
  );
}

export default App;
