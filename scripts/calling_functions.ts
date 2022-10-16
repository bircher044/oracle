import {ethers} from "hardhat";
import {Token_rate__factory} from "../typechain-types";

const tokenRateContractAddress = "0x11Cb5c3998fF9fdbBCce00AaAaa5173e8BEba8E2";

const tokenContractAddress = "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05";
const chainlinkContractAddress = "0x48731cF7e84dc94C5f84577882c14Be11a5B7456";

const pairTokenContractAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

const main = async () => {
  const [signer] = await ethers.getSigners();

  const tokenRate = Token_rate__factory.connect(tokenRateContractAddress, signer);
  
  //await (await tokenRate.setOracle(tokenContractAddress, chainlinkContractAddress)).wait();

  //const result = await tokenRate.getRateFromOracle(tokenContractAddress);
  //console.log( (result[0]).toString() + " " + (result[1]).toString() );

  const result = await tokenRate.calculateTokenRate(tokenContractAddress, pairTokenContractAddress);
  console.log((result[0]).div(result[1]).toString());
};

main();