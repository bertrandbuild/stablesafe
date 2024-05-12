// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PayableContract.sol";

/// @notice A struct that defines a prediction entity
struct Prediction {
    uint256 id;
    uint256 date;
    uint256 assetId;
    address predictor;
    uint8 notation;
    string notationReason;
}

/// @notice Mappings to important predictions which notify users and need to be staked
struct StakedPrediction {
    // From Prediction
    uint256 id;
    uint256 date;
    uint256 assetId;
    address predictor;
    uint8 notation;
    string notationReason;
    // Stake information
    uint256 stake;
    bool isPredictionCorrect;
    bool isAssessed;
}

/**
 * @title PredictionContract
 * @dev A contract that allows whitelisted users to add predictions and manage them.
 */
contract PredictionContract is Ownable, ReentrancyGuard, PayableContract {
    /// @notice The current prediction ID counter
    uint256 private currentId;
    uint256 private currentStakedId;
    uint256 public constant STAKE_MULTIPLIER = 1;
    /// @notice Array of all predictions IDs
    uint256[] public predictionIds;
    uint256[] public stakedPredictionIds;

    /// @notice Mappings to manage predictions, whitelist status, and asset-related predictions
    mapping(uint256 => Prediction) public predictions;
    mapping(uint256 => StakedPrediction) public stakedPredictions;
    mapping(address => bool) public whitelist;

    /// @notice Events to emit on important actions
    event PredictionAdded(uint256 indexed id, address indexed predictor);
    event Whitelisted(address indexed account, bool status);
    event ImportantPredictionAdded(
        uint256 indexed id,
        address indexed predictor,
        uint256 stake
    );
    event PredictorRewardPaid(address indexed predictor, uint256 reward);
    event PredictorStakeLost(address indexed predictor, uint256 stake);

    /**
     * @notice Constructor initializes the contract with an initial owner and sets the starting prediction ID
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        currentId = 1;
        currentStakedId = 1;
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

        emit PredictionAdded(newId, msg.sender);
    }

    /**
     * @notice Add a new staked prediction
     * @param _date The date of the prediction (Unix timestamp)
     * @param _assetId The ID of the predicted asset
     * @param _notation The prediction rating (1 to 5)
     * @param _notationReason The reason for the prediction notation
     */
    function addStakedPrediction(
        uint256 _date,
        uint256 _assetId,
        uint8 _notation,
        string memory _notationReason
    ) public payable onlyWhitelisted nonReentrant {
        require(_notation >= 1 && _notation <= 5, "Invalid notation");

        uint256 newId = currentStakedId++;

        // Handle important predictions which need to be staked
        require(msg.value > 0, "Stake amount must be greater than zero");

        stakedPredictions[newId] = StakedPrediction({
            id: newId,
            date: _date,
            assetId: _assetId,
            predictor: msg.sender,
            notation: _notation,
            notationReason: _notationReason,
            // Stake information
            stake: msg.value,
            isPredictionCorrect: false,
            isAssessed: false
        });

        stakedPredictionIds.push(newId);

        emit ImportantPredictionAdded(newId, msg.sender, msg.value);
    }

    function resolvePrediction(uint256 id, bool correct) external nonReentrant {
        require(stakedPredictions[id].stake > 0, "No stake found");
        require(stakedPredictions[id].isAssessed == false, "This prediction has already been assessed");

        uint256 initialStake = stakedPredictions[id].stake;
        uint256 rewardAmount = initialStake * STAKE_MULTIPLIER;

        if (correct) {
            require(
                address(this).balance >= rewardAmount,
                "Insufficient funds in contract"
            );
            payable(stakedPredictions[id].predictor).transfer(rewardAmount);
            stakedPredictions[id].isPredictionCorrect = true;
            emit PredictorRewardPaid(
                stakedPredictions[id].predictor,
                rewardAmount
            );
        } else {
            emit PredictorStakeLost(
                stakedPredictions[id].predictor,
                rewardAmount
            );
        }

        stakedPredictions[id].isAssessed = true;
    }

    /**
     * @notice Retrieve a specific prediction by its ID
     */
    function getPrediction(
        uint256 _id
    ) public view returns (Prediction memory) {
        return predictions[_id];
    }

    /**
     * @notice Retrieve all prediction IDs
     */
    function getAllPredictionIds() public view returns (uint256[] memory) {
        return predictionIds;
    }

    /**
     * @notice Retrieve a specific stakedPrediction by its ID
     */
    function getStakedPrediction(
        uint256 _id
    ) public view returns (StakedPrediction memory) {
        return stakedPredictions[_id];
    }

    /**
     * @notice Retrieve all prediction IDs
     */
    function getAllStakedPredictionIds()
        public
        view
        returns (uint256[] memory)
    {
        return stakedPredictionIds;
    }
}
