import { ethers } from "hardhat";
import { Contract, BigNumber, Wallet, ContractFactory, providers } from "ethers"; 
import { expect } from "chai";
import "console";

let ethTokenAddress = "0x764f8ea5602334F89031a385c79E572D2fc3063A";
let usdcTokenAddress = "0xCcf84eA2cc4B593AeBF58d0637CF8B6237b24C59";

let ethPrice;
let ethDecimals;
let usdcPrice;
let usdcDecimals;

describe("token_rate contract", async () => {

    let token_rate : Contract;
    let oracleEth : Contract;
    let oracleUsdc : Contract;

    beforeEach( async () => {

        let token_rateContractFactory : ContractFactory = await ethers.getContractFactory('TokenRate');
        let oracleEthContractFactory : ContractFactory = await ethers.getContractFactory('AggregatorProxyETH');
        let oracleUsdcContractFactory : ContractFactory = await ethers.getContractFactory('AggregatorProxyUSDC');

        token_rate = await token_rateContractFactory.deploy();
        oracleEth = await oracleEthContractFactory.deploy(ethers.constants.AddressZero);
        oracleUsdc = await oracleUsdcContractFactory.deploy(ethers.constants.AddressZero);

    });

    describe('Deployment', async () => {

        it('Should set the right owner', async () => {
            expect(await token_rate.owner()).to.equal(await token_rate.owner()); //!!!!!!!!!!!!
        });

    });

    describe('set, remove & get oracle functions', async () => {

        let tokenAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
        let oracleAddress = "0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7";

        it('Should revert a transaction when the token never had an oracle', async () => {

            await expect(token_rate.removeOracle(tokenAddress)).to.be.revertedWith("already removed or never existed");

        });

        it('Should return zero address when oracle never been set', async () => {

            expect(await token_rate.getOracle(tokenAddress)).to.equal(ethers.constants.AddressZero);

        });

        it('Should set the correct oracle address', async () => {

            await token_rate.setOracle(tokenAddress, oracleAddress);
            expect(await token_rate.getOracle(tokenAddress)).to.equal(oracleAddress);

        });

        it('Should remove oracle', async () => {

            await token_rate.setOracle(tokenAddress, oracleAddress);
            expect(await token_rate.getOracle(tokenAddress)).to.equal(oracleAddress);

            await token_rate.removeOracle(tokenAddress);
            expect(await token_rate.getOracle(tokenAddress)).to.equal(ethers.constants.AddressZero);

        });

        it('Should revert a transaction when the token already has no oracle', async () => {

            await token_rate.setOracle(tokenAddress, oracleAddress);
            expect(await token_rate.getOracle(tokenAddress)).to.equal(oracleAddress);

            await token_rate.removeOracle(tokenAddress);
            expect(await token_rate.getOracle(tokenAddress)).to.equal(ethers.constants.AddressZero);

            await expect(token_rate.removeOracle(tokenAddress)).to.be.revertedWith("already removed or never existed");

        });

    });
    
    describe('getRateFromOracle function', async () => {

        beforeEach( async () => {
            let usdcOracleAddress = oracleUsdc.address;
            let ethOracleAddress = oracleEth.address;

            await token_rate.setOracle(usdcTokenAddress, usdcOracleAddress);
            await token_rate.setOracle(ethTokenAddress, ethOracleAddress);
        });

        it('Should revert when recieve an address without oracle', async () => {

            expect(token_rate.getRateFromOracle(ethers.constants.AddressZero)).to.be.revertedWith("not available");

        });

        it('Should return the correct eth price', async () => {

            ethPrice = (await oracleEth.latestRoundData())[1];

            expect(ethPrice).to.equal((await token_rate.getRateFromOracle(ethTokenAddress))[0]);

        });

        it('Should return the correct eth decimals', async () => {

            ethDecimals = (await oracleEth.decimals());

            expect(ethDecimals).to.equal((await token_rate.getRateFromOracle(ethTokenAddress))[1]);

        });

        it('Should return the correct usdc price', async () => {

            usdcPrice = (await oracleUsdc.latestRoundData())[1];

            expect(usdcPrice).to.equal((await token_rate.getRateFromOracle(usdcTokenAddress))[0]);

        });

        it('Should return the correct usdc decimals', async () => {

            usdcDecimals = (await oracleUsdc.decimals());

            expect(usdcDecimals).to.equal((await token_rate.getRateFromOracle(usdcTokenAddress))[1]);

        });

    });

    describe('getRateFromOracle function', async () => {

        beforeEach( async () => {
            let usdcOracleAddress = oracleUsdc.address;
            let ethOracleAddress = oracleEth.address;

            await token_rate.setOracle(usdcTokenAddress, usdcOracleAddress);
            await token_rate.setOracle(ethTokenAddress, ethOracleAddress);

        });

        it('Should return the correct eth * usdcDecimals value', async () => {

            expect(ethPrice * (10 ** usdcDecimals)).to.equal((await token_rate.calculateTokenRate(ethTokenAddress, usdcTokenAddress))[0]);

        });

        it('Should return the correct usdc * ethDecimals value', async () => {

            expect(BigNumber.from(usdcPrice).mul(BigNumber.from(10).pow(ethDecimals))).to.equal((await token_rate.calculateTokenRate(ethTokenAddress, usdcTokenAddress))[1]);

        });

    });

});