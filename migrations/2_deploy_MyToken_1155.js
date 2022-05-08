require('dotenv').config()
var BigNumber = require('bignumber.js');

const {TOKEN_BASE_URI, TOKEN_PRICE_BY_ETH, TOKEN_PRICE_BY_ERC20, SET_COUNT, AMOUNT_LIMIT_OF_TOKEN} = process.env;
const MyToken_1155 = artifacts.require("MyToken_1155");

module.exports = function (deployer) {
  deployer.deploy(MyToken_1155, TOKEN_BASE_URI, 
    new BigNumber(TOKEN_PRICE_BY_ETH),
    new BigNumber(TOKEN_PRICE_BY_ERC20), 
    new BigNumber(SET_COUNT),
    new BigNumber(AMOUNT_LIMIT_OF_TOKEN)
    );
};
