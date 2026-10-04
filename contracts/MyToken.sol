// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals; // int

    uint256 public totalSupply;
    mapping(address => uint256) public balanceof;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _mint(1 * 10 ** uint256(decimals), msg.sender); //1MT
    }

    function _mint(uint256 amount, address owner) internal {
        totalSupply += amount;
        balanceof[owner] += amount;
    }

    //function totalSupply() external view returns (uint256) {
    //  return totalSupply;
    //}

    // function balanceof(address owner) external view returns unit256{
    //     return balanceof[owner];
    // }

    //function name() external view returns (string memory) {
    //    return name;
    //}
}
