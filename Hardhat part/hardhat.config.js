/**
* @type import('hardhat/config').HardhatUserConfig
*/
//import('hardhat/config').HardhatUserConfig
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");



/*
module.exports = {
   solidity: "0.8.11",
   defaultNetwork: "goerli",
   networks: {
      goerli: {
         url: process.env.API_URL,
         accounts: [process.env.PRIVATE_KEY],
   
      }
   },
}

module.exports = {
   solidity: "0.8.11",
   defaultNetwork: "goerli",
   networks: {
      goerli: {
         url: process.env.API_URL,
         accounts: process.env.PRIVATE_KEY !== undefined && process.env.PRIVATE_KEY1 != undefined &&  process.env.PRIVATE_KEY2 != undefined?
         [process.env.PRIVATE_KEY,process.env.PRIVATE_KEY1,process.env.PRIVATE_KEY2] : [],
   
      }
   },
}*/

module.exports = {
  networks: {
    sepolia: {
      url: process.env.API_URL,
      accounts: process.env.PRIVATE_KEY !== undefined && process.env.PRIVATE_KEY1 != undefined &&  process.env.PRIVATE_KEY2 != undefined?
         [process.env.PRIVATE_KEY,process.env.PRIVATE_KEY1,process.env.PRIVATE_KEY2] : [],
    },
  },
  solidity: "0.8.0",
};

        