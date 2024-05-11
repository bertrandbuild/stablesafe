// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "../src/PredictionContract.sol";

contract PredictionContractTest is Test {
    PredictionContract predictionContract;
    address owner;
    address addr1;
    address addr2;

    function setUp() public {
        owner = address(this);
        predictionContract = new PredictionContract(owner);
        addr1 = address(0x1);
        addr2 = address(0x2);
        predictionContract.addToWhitelist(addr1);
    }

    function testOwnerIsSetCorrectly() public view {
        assertEq(predictionContract.owner(), owner);
    }

    function testAddPrediction() public {
        vm.prank(addr1);
        uint256 current_id = 1;
        predictionContract.addPrediction(
            block.timestamp,
            1,
            5,
            "Huge depeg ! Risk is 5/5"
        );
        PredictionContract.Prediction memory prediction = predictionContract.getPrediction(current_id);
        assertEq(prediction.predictor, addr1);
        assertEq(prediction.notation, 5);
        assertEq(prediction.date, block.timestamp);
        assertEq(prediction.assetId, 1);
        assertEq(prediction.notationReason, "Huge depeg ! Risk is 5/5");
    }

    function testFailAddPredictionByNonWhitelisted() public {
        vm.prank(addr2);
        predictionContract.addPrediction(
            block.timestamp,
            1,
            5,
            "Should fail"
        );
    }

    function testAddToWhitelist() public {
        predictionContract.addToWhitelist(addr2);
        assertTrue(predictionContract.whitelist(addr2));
    }
}
