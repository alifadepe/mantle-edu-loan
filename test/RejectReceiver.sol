// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Helper Contract that rejects ETH
contract RejectReceiver {
    // No receive() or fallback() function means it rejects plain ETH transfers
    // unless it's a coinbase transaction or selfdestruct, which .call{value: ...} is not.
    // Explicitly defining them to revert for clarity if needed,
    // but default behavior of missing receive/fallback is to revert.

    receive() external payable {
        revert("I DO NOT ACCEPT ETH");
    }
}
