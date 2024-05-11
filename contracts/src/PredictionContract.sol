// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract PredictionContract is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {
        currentId = 1;
    }

    struct Prediction {
        uint256 id;
        uint256 date;
        uint256 assetId;
        address predictor;
        uint8 notation;
        string notationReason;
    }

    mapping(uint256 => Prediction) public predictions;
    mapping(address => bool) public whitelist;
    mapping(uint256 => uint256[]) public assetPredictions;

    uint256[] public predictionIds;
    uint256 private currentId;

    event PredictionAdded(uint256 indexed id, address indexed predictor);
    event Whitelisted(address indexed account, bool status);

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    function addToWhitelist(address _addr) public onlyOwner {
        whitelist[_addr] = true;
        emit Whitelisted(_addr, true);
    }

    function addPrediction(
        uint256 _date,
        uint256 _assetId,
        uint8 _notation,
        string memory _notationReason
    ) public onlyWhitelisted {
        require(_notation >= 1 && _notation <= 5, "Invalid notation");
        uint256 newId = currentId++;

        Prediction memory newPrediction = Prediction({
            id: newId,
            date: _date,
            assetId: _assetId,
            predictor: msg.sender,
            notation: _notation,
            notationReason: _notationReason
        });

        predictions[newId] = newPrediction;
        predictionIds.push(newId);
        assetPredictions[_assetId].push(newId);

        emit PredictionAdded(newId, msg.sender);
    }

    function getPrediction(
        uint256 _id
    ) public view returns (Prediction memory) {
        return predictions[_id];
    }

    function getAllPredictionIds() public view returns (uint256[] memory) {
        return predictionIds;
    }
}
