import {ethers} from "hardhat";
import {Bridge__factory} from "../typechain-types";

async function main() {
  const [signer] = await ethers.getSigners();
  const token_rate = await new Bridge__factory(signer).deploy(
    "0x8057bF74b08c9722be40f6c58e68ba08C0812D0c", 
    "0x9f6cfde3A4E72F06Fae97b95A7268070BA14d0eE");
  console.log(token_rate.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
