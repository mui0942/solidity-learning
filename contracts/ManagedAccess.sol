//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

abstract contract ManagedAccess {
    address public owner;
    address public manager;

    address public manager1;
    address public manager2;
    address public manager3;

    bool public confirm1;
    bool public confirm2;
    bool public confirm3;

    constructor(address _owner, address _manager) {
        owner = _owner;
        manager = _manager;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized");
        _;
    }

    modifier onlyManager() {
        require(
            msg.sender == manager,
            "You are not authorized to manage this contract"
        );
        _;
    }

    function setManagers(
        address _manager1,
        address _manager2,
        address _manager3
    ) external onlyOwner {
        require(
            _manager1 != _manager2 &&
                _manager1 != _manager3 &&
                _manager2 != _manager3,
            "Duplicate manager"
        );

        manager1 = _manager1;
        manager2 = _manager2;
        manager3 = _manager3;

        confirm1 = false;
        confirm2 = false;
        confirm3 = false;
    }

    function confirm() external {
        if (msg.sender == manager1) {
            confirm1 = true;
        } else if (msg.sender == manager2) {
            confirm2 = true;
        } else if (msg.sender == manager3) {
            confirm3 = true;
        } else {
            revert("You are not a manager");
        }
    }

    modifier onlyAllConfirmed() {
        require(
            msg.sender == manager1 ||
                msg.sender == manager2 ||
                msg.sender == manager3,
            "You are not a manager"
        );

        require(confirm1 && confirm2 && confirm3, "Not all confirmed yet");

        _;

        confirm1 = false;
        confirm2 = false;
        confirm3 = false;
    }
}
