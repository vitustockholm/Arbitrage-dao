// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library UniV2Math {
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        uint256 amountInWithFee = amountIn * 997;

        uint256 numerator = amountInWithFee * reserveOut;

        uint256 denominator = reserveIn * 1000 + amountInWithFee;

        amountOut = numerator / denominator;
    }
}
