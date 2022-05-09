const MyToken1155Contract = artifacts.require('MyToken_1155');
const MyToken20Mock = artifacts.require('MyToken_20');

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const { expect } = require('chai');
const toBN = web3.utils.toBN;

contract("MyToken_1155 Contract Test Suite", function (accounts) {
    
    const ownerAddress = accounts[5];
    const myToken20MockOwnerAddress = accounts[7];

    // constructor params
    const tokenBaseUri = 'test.base/uri/';
    const tokenPriceByEth = toBN(1e16);
    const tokenPriceByErc20 = toBN(30e18);
    const maxTokenId = 10;
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
            maxTokenId,
            amountLimitOfToken,
            myToken20Mock.address,
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
            const receipt = await myToken1155Contract.mintByEth(tokenId, amount, { from: nonOwnerAddress, value: toBN(tokenPriceByEth) * amount });

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

            let balanceOfContract = await web3.eth.getBalance(myToken1155Contract.address);
            expect(balanceOfContract.toString()).to.be.equal((tokenPriceByEth * amount).toString());
        });
    });

    describe("mintByERC20", () => {
        it('Should fail if not existing Token ID is specified', async () => {
            const nonOwnerAddress = accounts[1];
            const tokenId = 11;
            const amount = 20;
            await expectRevert(myToken1155Contract.mintByErc20(tokenId, amount, { from: nonOwnerAddress }), 'Incorrect Token ID!');
        });

        it('Should fail if Amount Limit is exceeded', async () => {
            const nonOwnerAddress = accounts[1];
            const tokenId = 1;
            const amount = 1001;
            await expectRevert(myToken1155Contract.mintByErc20(tokenId, amount, { from: nonOwnerAddress }), 'Total amount must be less than limit!');
        });

        it('Should fail if insufficient balance to mint token', async () => {
            const nonOwnerAddress = accounts[2];
            const tokenId = 1;
            const amount = 40;
            await expectRevert(myToken1155Contract.mintByErc20(tokenId, amount, { from: nonOwnerAddress }), 'Insufficient balance to mint token!');
        });

        it('Should fail if it is not approved before transfering', async () => {
            const nonOwnerAddress = accounts[2];
            const tokenId = 3
            const amount = 50;
            const totalCountOfErc20Tokens = toBN("1000000000000000000000000");
            await myToken20Mock.mint(totalCountOfErc20Tokens, { from: myToken20MockOwnerAddress});
            const totalPrice = toBN(tokenPriceByErc20).mul(toBN(amount));
            await myToken20Mock.transfer(nonOwnerAddress, totalPrice, {from: myToken20MockOwnerAddress});
            const balance1 = await myToken20Mock.balanceOf(myToken20MockOwnerAddress);
            expect(balance1.toString()).to.be.equal((totalCountOfErc20Tokens.sub(totalPrice)).toString());
            const balance2 = await myToken20Mock.balanceOf(nonOwnerAddress);
            expect(balance2.toString()).to.be.equal(totalPrice.toString());
            await expectRevert(myToken1155Contract.mintByErc20(tokenId, amount, { from: nonOwnerAddress }), 'Must be approved before transfering!');
        });

        it('Should successfully mint token', async () => {
            const nonOwnerAddress = accounts[2];
            const spender = myToken1155Contract.address;
            const tokenId = toBN(3);
            const amount = toBN(50);
            const totalCountOfErc20Tokens = toBN("1000000000000000000000000");
            await myToken20Mock.mint(totalCountOfErc20Tokens, { from: myToken20MockOwnerAddress});
            const totalPrice = toBN(tokenPriceByErc20).mul(toBN(amount));
            await myToken20Mock.transfer(nonOwnerAddress, totalPrice, {from: myToken20MockOwnerAddress});
            const balance1 = await myToken20Mock.balanceOf(myToken20MockOwnerAddress);
            expect(balance1.toString()).to.be.equal((totalCountOfErc20Tokens.sub(totalPrice)).toString());
            const balance2 = await myToken20Mock.balanceOf(nonOwnerAddress);
            expect(balance2.toString()).to.be.equal(totalPrice.toString());
            await myToken20Mock.approve(spender, totalPrice, {from: nonOwnerAddress});
            const receipt = await myToken1155Contract.mintByErc20(tokenId, amount, { from: nonOwnerAddress });

            expectEvent(receipt, 'MintByErc20', {
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

            const balance3 = await myToken20Mock.balanceOf(nonOwnerAddress);
            expect(balance3.toString()).to.be.equal('0');

            const balance4 = await myToken20Mock.balanceOf(myToken1155Contract.address);
            expect(balance4.toString()).to.be.equal(totalPrice.toString());
        });
    });

    describe("changeMaxTokenId", () => {

        it('Should fail if caller is not the contract owner', async () => {
            const nonOwnerAddress = accounts[1];
            const maxTokenId = 12;
            await expectRevert(myToken1155Contract.changeMaxTokenId(maxTokenId, { from: nonOwnerAddress }), 'Ownable: caller is not the owner.');
        });

        it('Should fail if the specified Max Token ID is less than the exiting one', async () => {
            const maxTokenId = 9;
            await expectRevert(myToken1155Contract.changeMaxTokenId(maxTokenId, { from: ownerAddress }), 'Max Token ID must be greater than the exiting one!');
        });

        it('Should successfully change the Max Token ID', async () => {
            const maxTokenId = 12;
            await myToken1155Contract.changeMaxTokenId(maxTokenId, { from: ownerAddress });
        });
    });
})
