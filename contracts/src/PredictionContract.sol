// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title PredictionContract
 * @dev A contract that allows whitelisted users to add predictions and manage them.
 */
contract PredictionContract is Ownable {
    /// @notice The current prediction ID counter
    uint256 private currentId;

    /// @notice A struct that defines a prediction entity
    struct Prediction {
        uint256 id;
        uint256 date;
        uint256 assetId;
        address predictor;
        uint8 notation;
        string notationReason;
    }

    /// @notice Mappings to manage predictions, whitelist status, and asset-related predictions
    mapping(uint256 => Prediction) public predictions;
    mapping(address => bool) public whitelist;
    mapping(uint256 => uint256[]) public assetPredictions;

    /// @notice An array of all prediction IDs
    uint256[] public predictionIds;

    /// @notice Events to emit on important actions
    event PredictionAdded(uint256 indexed id, address indexed predictor);
    event Whitelisted(address indexed account, bool status);

    /**
     * @notice Constructor initializes the contract with an initial owner and sets the starting prediction ID
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        currentId = 1;
    }

    /// @notice Modifier to enforce that only whitelisted addresses can execute certain functions
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    /**
     * @notice Add an address to the whitelist
     * @param _addr The address to be whitelisted
     */
    function addToWhitelist(address _addr) public onlyOwner {
        whitelist[_addr] = true;
        emit Whitelisted(_addr, true);
    }

    /**
     * @notice Add a new prediction
     * @param _date The date of the prediction (Unix timestamp)
     * @param _assetId The ID of the predicted asset
     * @param _notation The prediction rating (1 to 5)
     * @param _notationReason The reason for the prediction notation
     */
    function addPrediction(
        uint256 _date,
        uint256 _assetId,
        uint8 _notation,
        string memory _notationReason
    ) public onlyWhitelisted {
        require(_notation >= 1 && _notation <= 5, "Invalid notation");

        uint256 newId = currentId++;

        predictions[newId] = Prediction({
            id: newId,
            date: _date,
            assetId: _assetId,
            predictor: msg.sender,
            notation: _notation,
            notationReason: _notationReason
        });

        predictionIds.push(newId);
        assetPredictions[_assetId].push(newId);

        emit PredictionAdded(newId, msg.sender);
    }

    /**
     * @notice Retrieve a specific prediction by its ID
     * @param _id The ID of the prediction to fetch
     * @return The prediction struct with all associated data
     */
    function getPrediction(
        uint256 _id
    ) public view returns (Prediction memory) {
        return predictions[_id];
    }

    /**
     * @notice Retrieve all prediction IDs
     * @return An array of all prediction IDs
     */
    function getAllPredictionIds() public view returns (uint256[] memory) {
        return predictionIds;
    }
}
