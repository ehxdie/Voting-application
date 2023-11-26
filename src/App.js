import { useState, useEffect } from "react";
import {ethers} from "ethers";
import { contractAbi,contractAddress } from "./Constants/constant";
import Login from "./Components/Login";
import Connected from "./Components/Connected";
import './App.css';

function App() {
  const [provider,setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [CanVote, setCanVote] = useState(true);
  const [number, setNumber] = useState('');

 // This will execute first when the application is loaded and will check if the metamask account has changed and the lists of candidates will
 // then be loaded in
  useEffect (() => {
    getCandidates();
    if (window.ethereum) {
      window.ethereum.on('accountschanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum){
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });

  // This function checks if the voter trying to vote is allowed to vote
  async function canVote() {
      // Checks if the application is connected to metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      // Creates a contract instance that allows for communication with the contract
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const voteStatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(voteStatus);

  }

  // This function handles the actual voting process 
  async function vote() {
    // Checks if the application is connected to metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
    // Creates a contract instance that allows for communication with the contract
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );

      const votingtTransaction = await contractInstance.vote(number);
      await votingtTransaction.wait();
      canVote();
  }
  
  

  // This function returns all the available candidates

  async function getCandidates() {
    // Ensures that the voter is connected to metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

    // Creates an instance of the contract so that the candidate functions can be interacted with
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber()
        }
      });
      setCandidates(formattedCandidates);
  }

  // This function would be called if the metamask account changes, and sets the account state to the current metamask address 
  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      // Checks if the account can vote
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
      
    }
  }
  
  // This function checks if its possible to connect to metamask
  async function connectToMetamask () {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);

        // This gets the current account signed into
        const signer = provider.getSigner();

        // Collects the address of the current account and displays it
        const address = await signer.getAddress();

        // And then sets the account state to the metamask address which will then be passed to the "Connected" component
        setAccount(address)
        canVote();
        console.log("Metamask Connected : " + address);

        // if the application successfully connects to metamask set the isconnected state to true
        setIsConnected(true);
        
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected")

    }
  }

  // This function handles the number change
  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      {isConnected? 
      <Connected
       account = {account}
       candidates = {candidates}
       vote = {vote}
       number = {number}
       handleNumberChange = {handleNumberChange}
       showButton = {CanVote}
       />
       :  
       <Login connectWallet = {connectToMetamask}/>}
   
    </div>
  );
}

export default App;
