import logo from './logo.svg';
import './App.css';
import { VotingProvider } from './context/Voter';
import  { useState, useEffect,useContext} from "react";
import Navbar from './components/Navbar';
function App() {
  const {votingTitle} = useContext(VotingProvider);
  return (
    <VotingProvider>
      <Navbar/>
      <div>
        <h1>{votingTitle}</h1>
      </div>
    </VotingProvider>
  );
}

export default App;
