require('dotenv').config()
var BigNumber = require('bignumber.js');

const {TOKEN_BASE_URI, TOKEN_PRICE_BY_ETH, SET_COUNT, AMOUNT_LIMIT_OF_TOKEN} = process.env;
const MyToken_721 = artifacts.require("MyToken_1155");

module.exports = function (deployer) {
  deployer.deploy(MyToken_721, TOKEN_BASE_URI, 
    new BigNumber(TOKEN_PRICE_BY_ETH), 
    new BigNumber(SET_COUNT),
    new BigNumber(AMOUNT_LIMIT_OF_TOKEN)
    );
};
