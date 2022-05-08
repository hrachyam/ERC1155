const MyToken1155Contract = artifacts.require('MyToken_1155');
const MyToken20Mock = artifacts.require('MyToken_20');

const { expectRevert } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');
const toBN = web3.utils.toBN;

contract("MyToken_1155 Contract Test Suite", function (accounts) {
    
    const ownerAddress = accounts[5];

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
        myToken20Mock = await MyToken20Mock.new('Hrach USDC', 'HUSDC', { from: accounts[1] });

        myToken1155Contract = await MyToken1155Contract.new(
            tokenBaseUri,
            tokenPriceByEth,
            tokenPriceByErc20,
            setCount,
            amountLimitOfToken,
            { from: ownerAddress }
        );
    });

    describe("mintByEth", () => {
        it('Should fail if Token ID is not in range [1, 10]', async () => {
            const nonOwnerAddress = accounts[1];
            const tokenId = 11;
            await expectRevert(myToken1155Contract.mintByEth(tokenId, 20, { from: nonOwnerAddress }), 'Incorrect Token ID!');
        });
    });
});