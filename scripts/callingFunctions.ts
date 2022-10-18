import {ethers} from "hardhat";
import {TokenRate__factory} from "../typechain-types";

const tokenRateContractAddress = "0xEC300D5a7a24AF411708315258fE79252B89419b";

const tokenContractAddress = "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05";
const chainlinkContractAddress = "0xA39434A63A52E749F02807ae27335515BA4b07F7";

const pairTokenContractAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

const main = async () => {

  const [signer] = await ethers.getSigners();

  const tokenRate = TokenRate__factory.connect(tokenRateContractAddress, signer);
  
  await (await tokenRate.setOracle(tokenContractAddress, chainlinkContractAddress)).wait();

  //const result = await tokenRate.getRateFromOracle(tokenContractAddress);
  //console.log( (result[0]).toString() + " " + (result[1]).toString() );

  //const result = await tokenRate.calculateTokenRate(tokenContractAddress, pairTokenContractAddress);
  //console.log((result[0]).div(result[1]).toString());
  
};

main();