// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Ticket_NFT.sol";


contract Organizer_manager is AccessControl{


    event OrganizationCreated(address indexed organizer, address nftContract);

    uint public nextNFTId;

    mapping (address => address) public organization_NFT;
    mapping (uint => address) public organizations;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    //----------------------------Create organization-------------------------------
    function create_organization(string memory _name, address _organizer_address)external onlyRole(DEFAULT_ADMIN_ROLE){
        require(_organizer_address != address(0), "Organizer address cannot be the zero address");
        require(organization_NFT[_organizer_address] == address(0));
        Ticket_NFT nft=new Ticket_NFT(_name, _organizer_address);

        
        organization_NFT[_organizer_address]=address(nft);
        organizations[nextNFTId]=_organizer_address;
        nextNFTId++;

        emit OrganizationCreated(_organizer_address, address(nft));
    }

    //get the organization NFT given the organizer address
    function getOrganizerNFT(address _organizer) external view returns (address) {
        return organization_NFT[_organizer];
    }

    //get the organizer adress given the organizer id
    function getOrganizationAddress(uint _id) external view returns (address) {
        return organizations[_id];
    }

    function getnextNFTId() external view returns (uint256) {
        return nextNFTId;
    } 

}
