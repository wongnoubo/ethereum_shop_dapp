var Store = artifacts.require("Store");

module.exports = function(deployer) {
    deployer.deploy(Store,100000, web3.utils.toWei('0.1', 'ether'));
};