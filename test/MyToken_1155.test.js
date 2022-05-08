const MyToken1155Contract = artifacts.require('MyToken_1155');
const MyToken20Mock = artifacts.require('MyToken_20');

const { expectRevert, expectEvent, constants } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');
const toBN = web3.utils.toBN;

contract("MyToken_1155 Contract Test Suite", function (accounts) {
    
    const ownerAddress = accounts[5];
    const myToken20MockOwnerAddress = accounts[7];

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
        myToken20Mock = await MyToken20Mock.new('Hrach USDC', 'HUSDC', { from: myToken20MockOwnerAddress });

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
        it('Should fail if not existing Token ID is specified', async () => {
            const nonOwnerAddress = accounts[1];
            const tokenId = 11;
            const amount = 20;
            await expectRevert(myToken1155Contract.mintByEth(tokenId, amount, { from: nonOwnerAddress }), 'Incorrect Token ID!');
        });

        it('Should fail if Amount Limit is exceeded', async () => {
            const nonOwnerAddress = accounts[1];
            const tokenId = 1;
            const amount = 1001;
            await expectRevert(myToken1155Contract.mintByEth(tokenId, amount, { from: nonOwnerAddress }), 'Total amount must be less than limit!');
        });

        it('Should fail if insufficient Ether to mint token', async () => {
            const nonOwnerAddress = accounts[2];
            const tokenId = 1;
            const amount = 40;
            await expectRevert(myToken1155Contract.mintByEth(tokenId, amount, { from: nonOwnerAddress, value: toBN(39e16) }), 'Insufficient Eth to mint token!');
        });

        it('Should successfully mint token', async () => {
            const nonOwnerAddress = accounts[2];
            const tokenId = toBN(1);
            const amount = toBN(40);
            const receipt = await myToken1155Contract.mintByEth(tokenId, amount, { from: nonOwnerAddress, value: toBN(40e16) });

            expectEvent(receipt, 'MintByEther', {
                sender: nonOwnerAddress,
                tokenId,
                amount 
            });

            const isExist = await myToken1155Contract.exists(tokenId);
            expect(isExist).to.be.true;

            const totalSupply = await myToken1155Contract.totalSupply(tokenId);
            expect(totalSupply.toString()).to.be.equal(amount.toString());

            const tokenBalance = await myToken1155Contract.balanceOf(nonOwnerAddress, tokenId);
            expect(tokenBalance.toString()).to.be.equal(amount.toString());
        });
    });
});