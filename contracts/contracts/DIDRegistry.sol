// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    struct DID {
        address owner;
        string document;
    }

    mapping(string => DID) public dids;

    event DIDRegistered(string indexed did, address owner);

    function registerDID(string memory did, string memory document) public {
        require(dids[did].owner == address(0), "DID already exists");
        dids[did] = DID(msg.sender, document);
        emit DIDRegistered(did, msg.sender);
    }

    function resolveDID(string memory did) public view returns (string memory) {
        return dids[did].document;
    }
}