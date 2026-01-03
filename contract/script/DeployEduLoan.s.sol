// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {EduLoan} from "../src/EduLoan.sol";

contract DeployEduLoan is Script {
    function run() external returns (EduLoan) {
        // Start broadcasting (account specified via --account flag)
        vm.startBroadcast();

        // Deploy
        EduLoan eduLoan = new EduLoan();

        console.log("EduLoan deployed to:", address(eduLoan));
        console.log("Owner:", eduLoan.owner());

        vm.stopBroadcast();

        return eduLoan;
    }
}
