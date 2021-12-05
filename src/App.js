import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0xc5AFef84CC571a0228C0C057cCC98eCcfA8A1811";
  const contractABI = abi.abi;


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const userAddyHere = document.getElementById('userAddr');
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        userAddyHere.innerText = account;
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      document.getElementById('userAddr').innerText = accounts[0];
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkwave = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const countButton = document.querySelector('.chkButton');
      let count = await wavePortalContract.getTotalWaves();
      let buttonString = "";

      if (!ethereum) { console.log('NOTE: no ethereum object!') }
      else {
        buttonString = "Total waves: " + count.toNumber();
        countButton.innerText = buttonString;
      }
    }
    catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there! </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <div id="spotForAddy">Your Address: <span id="userAddr"></span>
        </div></div>

        <div className="bio">
          I am sato kaiba and this is my wave machine! Built on Rinkeby thanks to <a href="https://buildspace.so/" id='bs-link'>Buildspace!</a>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        <button className="waveButton chkButton" style={{cursor:`zoom-in`}} onClick={checkwave}>
        How many waves?
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App
