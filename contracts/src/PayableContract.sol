// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PayableContract is ReentrancyGuard {
    // Event to emit when Ether is received
    event Received(address, uint);

    // Event to emit when Ether is withdrawn
    event Withdrawn(address to, uint amount);

    // Function to receive Ether, msg.data must be empty
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }

    // Function to withdraw all Ether from this contract.
    function withdraw(address payable _to) external nonReentrant {
        require(_to != address(0), "Cannot withdraw to the zero address");
        require(address(this).balance > 0, "Balance is 0");

        uint amount = address(this).balance;
        (bool success, ) = _to.call{value: amount}("");
        require(success, "Failed to send Ether");

        emit Withdrawn(_to, amount);
    }

    // Function to get the balance of the contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
