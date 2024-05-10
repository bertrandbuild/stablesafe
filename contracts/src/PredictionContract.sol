// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract PredictionContract is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    struct Prediction {
        bytes32 uuid;
        uint256 date;
        uint256 assetId;
        address predictor;
        uint8 notation;
        string notationReason;
    }

    mapping(bytes32 => Prediction) public predictions;
    mapping(address => bool) public whitelist;
    mapping(uint256 => bytes32[]) public assetPredictions;

    bytes32[] public predictionIds;

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    function addToWhitelist(address _addr) public onlyOwner {
        whitelist[_addr] = true;
    }

    function addPrediction(
        bytes32 _uuid,
        uint256 _date,
        uint256 _assetId,
        uint8 _notation,
        string memory _notationReason
    ) public onlyWhitelisted {
        require(_notation >= 1 && _notation <= 5, "Invalid notation");
        require(predictions[_uuid].uuid == 0, "UUID already exists");

        Prediction memory newPrediction = Prediction({
            uuid: _uuid,
            date: _date,
            assetId: _assetId,
            predictor: msg.sender,
            notation: _notation,
            notationReason: _notationReason
        });

        predictions[_uuid] = newPrediction;
        predictionIds.push(_uuid);
        assetPredictions[_assetId].push(_uuid);
    }

    function getPrediction(
        bytes32 _uuid
    ) public view returns (Prediction memory) {
        return predictions[_uuid];
    }

    function getAllPredictionIds() public view returns (bytes32[] memory) {
        return predictionIds;
    }
}
