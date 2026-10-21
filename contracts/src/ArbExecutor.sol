// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ArbExecutor
/// @notice Simple omnichaín-ready arbitrage executor stub.
/// @dev Extend with LayerZero V2 / CCTP for real cross-chain settlement.
contract ArbExecutor is Ownable, ReentrancyGuard {
    uint256 public minProfitBps = 30; // 0.30%
    mapping(address => bool) public approvedRouters;

    event OpportunityExecuted(
        address indexed token,
        uint256 amountIn,
        uint256 amountOut,
        uint256 profit
    );

    constructor() Ownable(msg.sender) {}

    function setMinProfit(uint256 bps) external onlyOwner {
        minProfitBps = bps;
    }

    function approveRouter(address router, bool ok) external onlyOwner {
        approvedRouters[router] = ok;
    }

    /// @notice Placeholder execution. In production: call DEX router or bridge.
    function executeArb(
        address token,
        uint256 amountIn,
        address router,
        bytes calldata data
    ) external nonReentrant onlyOwner returns (uint256 profit) {
        require(approvedRouters[router], "router not approved");
        // Pull tokens
        IERC20(token).transferFrom(msg.sender, address(this), amountIn);

        // Simulate / call router (real implementation would decode and call)
        uint256 amountOut = amountIn * (10000 + minProfitBps) / 10000; // stub

        uint256 balBefore = IERC20(token).balanceOf(address(this));
        // router.call(data); // uncomment and secure in production
        uint256 balAfter = IERC20(token).balanceOf(address(this));

        profit = balAfter > balBefore ? balAfter - balBefore : 0;
        require(profit * 10000 / amountIn >= minProfitBps, "insufficient profit");

        IERC20(token).transfer(owner(), profit);
        emit OpportunityExecuted(token, amountIn, amountOut, profit);
    }

    function emergencyWithdraw(address token) external onlyOwner {
        uint256 bal = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner(), bal);
    }
}
