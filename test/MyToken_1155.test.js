const MyToken1155Contract = artifacts.require('MyToken_1155');
const MyToken20Mock = artifacts.require('MyToken_20');
const { expect } = require('chai');
const toBN = web3.utils.toBN;

contract("MyToken_1155 Contract Test Suite", function (accounts) {
    
    // constructor params
    const tokenBaseUri = 'test.base/uri/';
    const tokenPriceByEth = toBN(1e16);
    const tokenPriceByErc20 = 30;
    const setCount = 10;
    const amountLimitOfToken = 1000;

    // contracts
    let myToken20Mock;
    let myToken1155Contract;

    beforeEach(async () => {
        myToken20Mock = await MyToken20Mock.new('Hrach USDC', 'HUSDC');

        myToken1155Contract = await MyToken1155Contract.new(
            tokenBaseUri,
            tokenPriceByEth,
            tokenPriceByErc20,
            setCount,
            amountLimitOfToken
        );
    });

    describe("mintByEth", () => {
        it("Should ", async () => {
            expect(1).to.be.equal(1);
        });
    });
});