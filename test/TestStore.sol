pragma solidity >=0.4.22 <0.6.0;

import "truffle/Assert.sol";   // 引入的断言
import "truffle/DeployedAddresses.sol";  // 用来获取被测试合约的地址
import "../contracts/Store.sol";//被测试合约

contract TestStore{
    Store store = Store(DeployedAddresses.Store());
}

