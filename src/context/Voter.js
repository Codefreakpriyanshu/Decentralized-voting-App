import React,{useState,useEffect} from 'react'
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {create as ipfsHttpClient} from "ipfs-http-client";
import axios from "axios";
import {voterContext} from "./VoterContext";
import {useRouter} from "next/router"
 

import { VotingAddress,VotingAddressABI } from './constant';
import { web3auth } from 'web3modal/dist/providers/connectors';

const client =  ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (SignerorProvider) =>{
    return new ethers.Contract(VotingAddress ,VotingAddressABI , SignerorProvider);
};
export const VotingProvider = ({children}) =>{
    const votingTitle = "My first Dapp";
    const router = useRouter();
    const  [currentAccount,setcurrentAccount] = useState('');
    const [candidateLength,setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray,setcandidateArray] = useState(pushCandidate);
    
    const [error ,setError] = useState('');
    const highestVote = [];
    
    const pushVoter = [];
    
    const [voterArray,setvoterArray] = useState(pushVoter);
    const [voterLength,setvoterLength] = useState('');
    const [voterAddress,setvoterAddress] = useState([]);


    const checkIfWalletIsConnected = async () =>{
      try{
        if(!window.ethereum) return setError("Please Connect METAMASK");
        const account  = await window.ethereum.request({method:"eth_account"});
        console.log(account);
        if(account.length){
          setcurrentAccount(account);
        }else{
            setError("Please install Metamask and Reload")
        }
    }
      catch(error){
        console.log(error);
      }
    }

    const ConnectWallet = async() =>{
      if(!window.ethereum) return setError("Please Install METAMASK");
      const account = await window.ethereum.request({method:"eth_requestAccounts",});
      setcurrentAccount(account[0]);
    }

    const UploadToIPFS = async(file) =>{
    try{
        const added = await client.add({content:file});
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    }catch(error){
      setError("Error Uploading File to IPFS");
    }
    }

    const createVoter = async({forminput,fileUrl,router})=>{
      try {
        const {name,address,position} = forminput;
        if(!name || !address || !position) return setError("Please Fill the form")

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider =  new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();   
        let contract = fetchContract(signer);

        const data = JSON.stringify({name,address,position,image:fileUrl});
        const added = await client.add(data);
        const url = `https://ipfs.infura.io/${added.path}`;
        const voter = await contract.voterRight(address,name,fileUrl,url);
        voter.wait();
        router.push("/voterList");
      } catch (error) {
        console.log(error);
      } 
    }

    const GetAllVoterData = async()=>{
      try {
        const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();    
      let contract = fetchContract(signer);
      const voterListData = await contract.getVoterList();
      setvoterAddress(voterListData);

      voterListData.map(async(el)=>{
        const singleVoterData = await contract.getVoterData(el);
        pushVoter.push(singleVoterData);
      });
      const voterList = await contract.getVoterLength();
      setvoterLength(voterList.toNumber());
      } catch (error) {
        setError(error);
      }
    } 

    const createCandidate =  async({Candidateforminput,fileUrl,router})=>{
      try {
        const {name,address,age} = Candidateforminput;
        if(!name || !address || !age) return setError("Please Fill the form")

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider =  new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();   
        let contract = fetchContract(signer);

        const data = JSON.stringify({name,address,age,image:fileUrl});
        const added = await client.add(data);
        const url = `https://ipfs.infura.io/${added.path}`;
        const candidate = await contract.setCandidate(address,age,name,fileUrl,url);
        candidate.wait();
        router.push("/");
      } catch (error) {
        console.log(error);
      } 
    }
    useEffect(() => {
      GetAllVoterData()
    }, [])

    const GetCandidateData = async()=>{
      try {
        const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();    
      let contract = fetchContract(signer);
      const CandidateListData = await contract.getCandidates();
      setcandidateArray(CandidateListData);

      CandidateListData.map(async(el)=>{
        const singleCandidateData = await contract.getCandidatedata(el);
        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
      });
      const CandidateList = await contract.getCandidateLength();
      setCandidateLength(voterList.toNumber());
      } catch (error) {
        setError(error);
      }
    } 
    return (
        <voterContext.Provider value={{votingTitle,checkIfWalletIsConnected,ConnectWallet,UploadToIPFS}}>
            {children}
        </voterContext.Provider>
    );
}
    
const Voter = () => {
  return (
    <div>
      
    </div>
  )
}

export default Voter
