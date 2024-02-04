// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Create{
    
    uint256 public _voterId = 1;
    uint256 public _candidtateId = 1;
    address public VotingOrganizer;
    address[] public candidateAdress;
    address[] public votedVoters;
    address[] public voterAddress;
    mapping(address => Candidate) candidates;
    mapping(address => Voter) public voters;

     

    struct Candidate{
        uint256 candidtateId;
        string age;
        string name;
        string image;
        uint256 votecount;
        address _address;
        string ipfs;
    }
    
    struct Voter{
        uint256 voter_voterId;
        string voter_name;
        string voter_image;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;
    }

    event CandidateCreated(
        uint256 indexed candidtateId,
        string age,
        string name,
        string image,
        uint256 votecount,
        address _address,
        string ipfs
    );
   

    event VoterCreated(
        uint256 voter_voterId,
        string voter_name,
        string voter_image,
        address voter_address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string voter_ipfs
    );

    constructor(){
        VotingOrganizer=msg.sender;
    }

    function setCandidate(address _address , string memory _age , string memory _name , string memory _image , string memory _ipfs) public{
        require(VotingOrganizer == msg.sender ,"Only the voting organiser can create a new voter");
        _candidtateId++;

        uint256 idnumber = _candidtateId;

        Candidate storage candidate = candidates[_address];
        candidate.age = _age;
        candidate.name = _name;
        candidate._address = _address;
        candidate.candidtateId = _candidtateId;
        candidate.image = _image;
        candidate.ipfs = _ipfs;
        candidate.votecount = 0;
        
        candidateAdress.push(_address);
        emit CandidateCreated(
        idnumber,
        _age,
        _name,
        _image,
        candidate.votecount,
        _address,
        _ipfs
        );
    }

    function getCandidates() public view returns(address[] memory){
        return candidateAdress;
    } 

    function getCandidateLength() public view returns(uint256){
        return candidateAdress.length;
    }

    function getCandidatedata(address _address) public view returns(string memory,string memory ,uint256,string memory,uint256,string memory,address ) {        
        return(
            candidates[_address].age,
            candidates[_address].name,
            candidates[_address].candidtateId,
            candidates[_address].image,
            candidates[_address].votecount,
            candidates[_address].ipfs,
            candidates[_address]._address
        );
    }

    function voterRight(address _address , string memory _name , string memory _image , string memory _ipfs) public {
        require(VotingOrganizer == msg.sender , "Only Organizer can create voter not you");

        _voterId++;
        uint256 IdNumber = _voterId;

        Voter storage voter = voters[_address];

        require(voter.voter_allowed == 0 ,"You have already voted !!");

        voter.voter_name = _name;
        voter.voter_address = _address ;
        voter.voter_allowed = 1;
        voter.voter_ipfs = _ipfs;
        voter.voter_image = _image;
        voter.voter_voterId = IdNumber;
        voter.voter_vote=1000;
        voter.voter_voted = false;

        voterAddress.push(_address);

        emit VoterCreated(
        IdNumber,
        _name,
        _image,
        _address,
        voter.voter_allowed,
        voter.voter_voted,
        voter.voter_vote,
        _ipfs
        );
    }  

    function vote(address _candidateaddress ,uint256 _candidateVoteId) external{
        Voter storage voter = voters[msg.sender];
        require(!voter.voter_voted ,"You have already voted");
        require(voter.voter_allowed != 0 ,"You are not allowed to vote");

        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;
        votedVoters.push(msg.sender);
        candidates[_candidateaddress].votecount += voter.voter_allowed;
    }

    function getVoterLength() public view returns(uint256)  {
        return voterAddress.length;
    }

    function getVoterData(address _address)  public view returns(uint256, string memory  , string memory  ,address , string memory ,uint256,bool){
        return(
            voters[_address].voter_voterId,
            voters[_address].voter_name,
            voters[_address].voter_image,
            voters[_address].voter_address,
            voters[_address].voter_ipfs,
            voters[_address].voter_allowed,
            voters[_address].voter_voted
        );
    }
    function getVotedVoterList() public view returns(address[] memory){
        return votedVoters;
    }
    function getVoterList() public view returns(address[] memory){
        return voterAddress;
    }
}
