// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Voting {
    // Creating the candidates data structure
    struct Candidate {
        string name;
        uint256 voteCount;
    }

// Creating a public candidates array that would host all the candidates involved
    Candidate[] public candidates;

// Declaring the owner variable (Would be used to set the owner of the contract)
    address owner;

// Creating a hash table that would store the addresses of the voters
    mapping(address => bool) public voters;

// The constructor function sets the owner of the contract as well as allows for the adding of candidates
constructor(string[] memory _candidateNames) {
    for (uint256 i = 0; i < _candidateNames.length; i++) {
        candidates.push(Candidate({
            name: _candidateNames[i],
            voteCount: 0
        }));
    }
    owner = msg.sender;
}


/*  This is the function that handles the actual voting, any address can execute this function
    It checks if the voter has already voted, i.e if the voter has already voted the voters address stored in the
    hash map would be set to true if not then the voter selects a candidates index and then votes
*/   
    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

// Return all the votes of the candidates 
    function getAllVotesOfCandiates() public view returns (Candidate[] memory){
        return candidates;
    }
    

}
 
 
  

 