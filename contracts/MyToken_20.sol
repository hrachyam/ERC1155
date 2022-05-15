// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken_20 is ERC20, Ownable, ReentrancyGuard {

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
    {}

    function mint(uint256 amount) external onlyOwner nonReentrant {
        _mint(msg.sender, amount);
    }
}