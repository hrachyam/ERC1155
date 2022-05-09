require('dotenv').config()
var BigNumber = require('bignumber.js');

const {TOKEN_BASE_URI, TOKEN_PRICE_BY_ETH, TOKEN_PRICE_BY_ERC20, MAX_TOKEN_ID, AMOUNT_LIMIT_OF_TOKEN, ERC20_ADDRESS} = process.env;
const MyToken_1155 = artifacts.require('MyToken_1155');
const MyToken_20 = artifacts.require('MyToken_20');

module.exports = async function (deployer, network) {
  let erc20Address = ERC20_ADDRESS;
  if (network !== 'mainnet') { 
    // deploy your ERC20 and use it's address instead of the address from env variable 
    await deployer.deploy(MyToken_20, 'Hrach USDC','HUSDC');
    const erc20 = await MyToken_20.deployed();
    erc20Address = erc20.address;
  } 
  deployer.deploy(MyToken_1155, TOKEN_BASE_URI, 
    new BigNumber(TOKEN_PRICE_BY_ETH),
    new BigNumber(TOKEN_PRICE_BY_ERC20), 
    new BigNumber(MAX_TOKEN_ID),
    new BigNumber(AMOUNT_LIMIT_OF_TOKEN),
    erc20Address
    );
};
