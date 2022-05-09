// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyToken_1155 is ERC1155Supply, Ownable, ReentrancyGuard {

    uint public tokenPriceByEth;
    uint public tokenPriceByErc20;
    uint public amountLimitOfToken;
    uint public maxTokenId;
    string private _tokenBaseUri;

    constructor(string memory baseUri, uint priceByEth, uint priceByErc20, uint maxToken, uint amountLimit) 
        ERC1155("") 
    {
        _tokenBaseUri = baseUri;
        maxTokenId = maxToken;
        amountLimitOfToken = amountLimit; 
        tokenPriceByEth = priceByEth;
        tokenPriceByErc20 = priceByErc20;
    }

    event MintByEther(address indexed sender, uint indexed tokenId, uint256 amount);
    event MintByErc20(address indexed sender, uint indexed tokenId, uint256 amount);

    function mintByEth(uint256 tokenId, uint256 amount) 
        external payable nonReentrant 
    {
        require(tokenId >= 1 && tokenId <= maxTokenId, "Incorrect Token ID!");
        require(totalSupply(tokenId) + amount <= amountLimitOfToken, "Total amount must be less than limit!");
        require(msg.value >= tokenPriceByEth * amount, "Insufficient Eth to mint token!");
        emit MintByEther(msg.sender, tokenId, amount);
        _mint(msg.sender, tokenId, amount, "");
    }

    function mintByErc20(address erc20, uint256 tokenId, uint256 amount) 
        external payable nonReentrant 
    {
        require(tokenId >= 1 && tokenId <= maxTokenId, "Incorrect Token ID!");
        require(totalSupply(tokenId) + amount <= amountLimitOfToken, "Total amount must be less than limit!");
        IERC20 erc20Token = IERC20(erc20);
        uint totalPrice = tokenPriceByErc20 * amount;
        require(erc20Token.balanceOf(msg.sender) >= totalPrice, "Insufficient balance to mint token!");
        require(erc20Token.allowance(msg.sender, address(this)) >= totalPrice, "Must be approved before transfering!");
        bool success = erc20Token.transferFrom(msg.sender, address(this), totalPrice);
        require(success, "Failed to transfer!");
        emit MintByErc20(msg.sender, tokenId, amount);
        _mint(msg.sender, tokenId, amount, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_tokenBaseUri, Strings.toString(tokenId)));
    }

    function changemaxTokenId(uint maxToken) external onlyOwner  {
        require(maxTokenId < maxToken, "Max Token ID must be greater than the exiting one!");
        maxTokenId = maxToken;
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
