import logo from './logo.svg';
import React, { useState } from 'react'
import './App.css';
import detectEthereumProvider from "@metamask/detect-provider"

function App() {

  let [buttonTitle, setButtonTitle] = useState([])
  let [account, setAccount] = useState([])
  let [network, setNetwork] = useState([])

  buttonTitle = "Connect to Metamask"

  const chainIds = {
    "0x1": "Ethereum Main Network",
    "0x3": "Ropsten Test Network",
    "0x4": "Rinkeby Test Network"
  }

  async function startApp() {
    try {
      const provider = await detectEthereumProvider()
  
      if (provider) {
        if (provider !== window.ethereum) {
          console.log("Do you have multiple wallets installed?")
        }
        return connectToMetamask()
      } else {
        console.log("Please install MetaMask!")
        return { currentAccount: "no_install" }
      }
    } catch (e) {
      console.log("Connection refush.")
      window.refresh()
    }
  }

  async function connectToMetamask() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })      
      setButtonTitle("Metamask Connected!")
      setAccount(accounts)

      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts, null)
      })
  
      const networkChainId = await window.ethereum.request({ method: "eth_chainId"})      
      setNetwork(chainIds[networkChainId])
    }
    catch (err) {
      if (err.code === 4001) {
        console.error(err)
        console.log("Please connect to MetaMask.")
      }
      throw err
    }
  }

  async function handleAccountsChanged(accounts, currentAccount) {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.")
    } else if (accounts[0] !== currentAccount) {
      return accounts[0]
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button className="App-button" onClick={startApp} > { buttonTitle } </button>
        <h4> Account : {account} </h4>
        <span> You are currently on {network} ! </span>
      </header>
    </div>
  );
}

export default App;
