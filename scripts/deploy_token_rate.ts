import {ethers} from "hardhat";
import {TokenRate__factory} from "../typechain-types";

async function main() {
  const [signer] = await ethers.getSigners();
  const token_rate = await new TokenRate__factory(signer).deploy();
  console.log(token_rate.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
