import { ethers } from "hardhat";
import { Contract, BigNumber, Wallet, ContractFactory, providers } from "ethers"; 
import { expect } from "chai";
import "console";

describe("token_rate contract", async () => {
    let contract : Contract;
    
    const ownerWalletPrivateKey : string = "9daecdbf121b0e934277243a5be420b4555d9790a6e457d282e31e83ebf7f5ae";
    let ownerWallet = new Wallet(ownerWalletPrivateKey, ethers.provider);

    beforeEach( async () => {

        let contractFactory : ContractFactory = await ethers.getContractFactory('token_rate');
        
        contract = await contractFactory.deploy();
    });

    describe('Deployment', async () => {
        it('Should set the right owner', async () => {
            expect(await contract.owner()).to.equal(await contract.address); //!!!!!!!!!!!!
        });
    });

    describe('set, remove & get oracle functions', async () => {
        let tokenAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
        let oracleAddress = "0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7";

        it('Should set the correct oracle address', async () => {
            await contract.setOracle(tokenAddress, oracleAddress);

            expect(await contract.getOracle(tokenAddress)).to.equal(oracleAddress);
        });

    });

});