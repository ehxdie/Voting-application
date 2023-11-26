const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Smart contract tests", function () {
  // Declaring necessary variables
  // This function will execute before each tests deploying the contract

  async function deployFixture () {

    // This gets the accounts that would be used to deploy the contract and interact with its functions
    [owner, addr1, addr2] = await ethers.getSigners();

    // Gives an object that will be used to interact with the blockchain
    const Voting = await ethers.getContractFactory("Voting");

    // Deploying the contract
    const voting = await Voting.deploy(["Alice", "Bob"]);

    return { owner, addr1, addr2, voting }
    
  };

  // First test: Should allow a voter to vote
  it("Should allow a voter to vote", async function () {
    const { addr2, voting} = await loadFixture(deployFixture);
    // Using the addr2 signer (representing a voter) to vote for candidate at index 0
    await voting.connect(addr2).vote(0);

    // Check if the candidate at index 0 received a vote
    const candidate = await voting.candidates(0);

     // Expect that the vote count for candidate 0 is 1 (since addr2 voted for them)
    expect(candidate.voteCount.toNumber()).to.equal(1);

    // Check if addr2's address is marked as a voter (voted once)
    expect(await voting.voters(addr2)).to.equal(true);
  });

  // Second test: Should not allow a voter to vote twice
  it("Should not allow a voter to vote twice", async function () {
  
    const { addr2, voting} = await loadFixture(deployFixture);
  // Using the addr2 signer to vote for candidate at index 0 (first vote)  
   await voting.connect(addr2).vote(0);

  // Attempt to vote again using the same addr2 signer for candidate at index 0
  // Expect that this transaction should revert with the message "You have already voted."
   await expect(voting.connect(addr2).vote(0)).to.be.revertedWith("You have already voted.");
  });

  // Third test: Should not allow voting for an invalid candidate index
  it("Should not allow voting for an invalid candidate index", async function () {
    const { addr2, voting} = await loadFixture(deployFixture);
    
  // Attempt to vote using the addr2 signer for an invalid candidate index (index 2)
  // Expect that this transaction should revert with the message "Invalid candidate index."
   await expect(voting.connect(addr2).vote(2)).to.be.revertedWith("Invalid candidate index.");
  });
});

