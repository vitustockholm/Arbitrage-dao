// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IAaveV3Pool.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./libraries/UniV2Math.sol";

contract FlashLoanArbExecutor {
    using UniV2Math for uint256;

    address public immutable owner;
    IAaveV3Pool public immutable aavePool;

    error NotOwner();

    struct ArbParams {
        address tokenBorrow;
        address tokenMid;
        address pair1;
        address pair2;
        uint256 minProfit;
    }

    constructor(address _aavePool) {
        owner = msg.sender;
        aavePool = IAaveV3Pool(_aavePool);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function startFlashLoan(
        address asset,
        uint256 amount,
        ArbParams calldata arbParams
    ) external onlyOwner {
        bytes memory params = abi.encode(arbParams);

        aavePool.flashLoanSimple(
            address(this),
            asset,
            amount,
            params,
            0
        );
    }

    receive() external payable {}
}
