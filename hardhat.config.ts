import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy-ethers";
import * as dotenv from 'dotenv';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
dotenv.config();

export default {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5
    },
    localhost: {
      chainId: 1337
    }
  
  }
};