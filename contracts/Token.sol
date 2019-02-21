pragma solidity >=0.4.22 <0.6.0;
// 代币系统
contract Token {

    uint tokenTotal;    // 代币总和
    uint tokenPrice;    // 代币价格
    uint balanceTokens; // 合约余额

    // 所有用户余额记录
    mapping(address=>uint) balances;

    event buySuccess(address addr, uint num);
    event sellSuccess(address addr, uint num);

    // 获取余额信息 [代币总和 代币价格 合约余额 合约金币 用户余额 用户金币]
    function getBalanceInfo() public view returns (
        uint, uint, uint, uint, uint, uint) {
        return (tokenTotal, tokenPrice,
                balanceTokens, address(this).balance,
                balances[msg.sender], msg.sender.balance);
    }

    // 买入代币
    function buy() public payable {
        uint tokensToBuy = msg.value / tokenPrice;
        require(tokensToBuy <= balanceTokens); // 合约代币是否足够

        // 更新信息
        balances[msg.sender] += tokensToBuy;
        balanceTokens -= tokensToBuy;
        emit buySuccess(msg.sender, tokensToBuy);
    }

    // 卖出代币
    function sell(uint tokensToSell) public {
        require(tokensToSell <= balances[msg.sender]); // 用户代币是否足够

        // 更新信息
        uint total = tokensToSell * tokenPrice;
        balances[msg.sender] -= tokensToSell;
        balanceTokens += tokensToSell;
        msg.sender.transfer(total);
        emit sellSuccess(msg.sender, tokensToSell);
    }
}
