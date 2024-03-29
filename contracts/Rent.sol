// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentAgreement {
    address payable public landlord;
    address public tenant;
    uint public rentAmount;
    uint public startTimestamp;
    uint public durationMonths;
    uint public rentPaidUntil;
    bool public isTerminated = false; // New variable to track contract state

    uint public constant penaltyRate = 10; // Penalty rate as a percentage of rent
    uint public constant gracePeriodEndDay = 7; // Grace period for rent payment without penalty

    bool public terminationRequested = false;
    address public terminationRequester;

    event RentPaid(address tenant, uint amount, uint paidUntil, uint penalty);
    event TerminationRequested(address requester);
    event AgreementTerminated(address terminator);

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only the landlord can perform this action.");
        _;
    }

    modifier onlyTenant() {
        require(msg.sender == tenant, "Only the tenant can perform this action.");
        _;
    }

    modifier notTerminated() {
        require(!isTerminated, "This contract has been terminated.");
        _;
    }

    modifier notTerminationRequester() {
        require(msg.sender != terminationRequester, "Requester cannot approve termination.");
        _;
    }

    constructor(address _landlord, uint _rentAmount,  uint _durationMonths) {
        require(_landlord != address(0), "Invalid landlord address.");
        landlord = payable(_landlord);
        rentAmount = _rentAmount;
        durationMonths = _durationMonths;
        startTimestamp = block.timestamp;
    }

    function setTenant(address _tenant) external onlyLandlord notTerminated {
        require(tenant == address(0), "Tenant already set.");
        tenant = _tenant;
    }

    function payRent() external payable onlyTenant notTerminated {
        require(!terminationRequested, "Termination requested, contract is pending closure.");
        require(block.timestamp < startTimestamp + (durationMonths * 30 days), "Rent agreement has expired.");
        uint currentMonth = (block.timestamp - startTimestamp) / 30 days;
        uint paymentDueDate = startTimestamp + (currentMonth * 30 days) + (gracePeriodEndDay * 1 days);
        uint penalty = 0;

        if (block.timestamp > paymentDueDate) {
            penalty = (rentAmount * penaltyRate) / 100;
        }

        require(msg.value == rentAmount + penalty, "Incorrect amount, penalty may apply.");
        rentPaidUntil = block.timestamp + 30 days;
        emit RentPaid(msg.sender, msg.value, rentPaidUntil, penalty);
    }

    function withdrawRent() external onlyLandlord notTerminated {
        require(!terminationRequested, "Termination requested, contract is pending closure.");
        uint amount = address(this).balance;
        require(amount > 0, "No funds to withdraw.");
        landlord.transfer(amount);
    }

    function requestTermination() external notTerminated {
        require(msg.sender == tenant || msg.sender == landlord, "Only tenant or landlord can request termination.");
        require(!terminationRequested, "Termination already requested.");
        terminationRequested = true;
        terminationRequester = msg.sender;
        emit TerminationRequested(msg.sender);
    }

    function approveTermination() external notTerminationRequester notTerminated {
        require(terminationRequested, "No termination requested to approve.");
        isTerminated = true; // Mark the contract as terminated
        emit AgreementTerminated(msg.sender);
        transferBalanceToLandlord();
    }

    function transferBalanceToLandlord() private {
        uint balance = address(this).balance;
        (bool sent, ) = landlord.call{value: balance}("");
        require(sent, "Failed to send Ether");
    }
}
