const MyToken_20 = artifacts.require("MyToken_20");

module.exports = function (deployer) {
  deployer.deploy(MyToken_20, "Hrach USDC","HUSDC");
};
