// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenRate is Ownable {

    mapping (address => address) oracles;

    event Withdrawal(uint amount, uint when);

    constructor() payable {
        transferOwnership(msg.sender);
    }

    function setOracle(address token_, address oracle_) public onlyOwner {
        oracles[token_] = oracle_;
    }

    function removeOracle(address token_) public onlyOwner {
        require(oracles[token_] != address(0x0), "TokenRate: already removed or never existed");
            oracles[token_] = address(0x0);
    }

    function getOracle(address _token) view public returns (address) {
        return oracles[_token];
    }

    function getRateFromOracle(address tokenAddress) public view returns (int256, uint8) {
        require(oracles[tokenAddress] != address(0), "TokenRate: not available");
        AggregatorV3Interface oracle = AggregatorV3Interface(oracles[tokenAddress]);

        (, int256 answer,,,) = oracle.latestRoundData();
    
        uint8 oracleDecimals = oracle.decimals();

        return (answer, oracleDecimals);
    }

    function calculateTokenRate(
        address firstTokenAddress,
        address secondTokenAddress
        ) public view returns (uint256, uint256) {

        (int256 firstAnswer, uint8 firstOracleDecimals) = getRateFromOracle(firstTokenAddress);
        (int256 secondAnswer, uint8 secondOracleDecimals) = getRateFromOracle(secondTokenAddress);

        return (uint256(firstAnswer) * (10 ** (secondOracleDecimals)),
            uint256(secondAnswer) * (10 ** (firstOracleDecimals)));
    }

}
