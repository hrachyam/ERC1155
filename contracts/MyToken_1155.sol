// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyToken_1155 is ERC1155Supply, Ownable, ReentrancyGuard {

    uint public tokenPriceByEth;
    uint public amountLimitOfToken;
    uint private _setCount;
    string private _tokenBaseUri;

    constructor(string memory baseUri, uint priceByEth, uint setCount, uint amountLimit) 
        ERC1155("") 
    {
        _tokenBaseUri = baseUri;
        _setCount = setCount;
        amountLimitOfToken = amountLimit; 
        tokenPriceByEth = priceByEth;
    }

    function mintByEth(uint256 tokenId, uint256 amount) 
        external payable nonReentrant 
    {
        require(tokenId >= 1 && tokenId <= _setCount, "Incorrect Token ID");
        require(totalSupply(tokenId) + amount <= amountLimitOfToken, "Total amount must be less than limit!");
        require(msg.value >= tokenPriceByEth * amount, "Token price is less!");
        _mint(msg.sender, tokenId, amount, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_tokenBaseUri, Strings.toString(tokenId)));
    }

    function changeSetCount(uint setCount) external onlyOwner  {
        require(_setCount < setCount, "Set Count must be greater than the exiting one!");
        _setCount = setCount;
    }

    function changeAmountLimitOfToken(uint amountLimit) external onlyOwner  {
        require(amountLimitOfToken < amountLimit, "Amount Limit of Token must be greater than the exiting one!");
        amountLimitOfToken = amountLimit;
    }

    function changeBaseUri(string calldata baseUri) external onlyOwner  {
        _tokenBaseUri = baseUri;
    }

    function withdraw(uint _amount) external payable onlyOwner {
        require(_amount <= address(this).balance, "Not enough amount of Ether!");
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Failed to transfer!");
    }
}
