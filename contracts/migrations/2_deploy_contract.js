const DIDRegistry = artifacts.require("DIDRegistry"); // Match EXACTLY with contract name in .sol file

module.exports = function (deployer) {
    deployer.deploy(DIDRegistry);
};