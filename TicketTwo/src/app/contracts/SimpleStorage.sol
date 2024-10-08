// SPDX-License-Identifier: GPL-3.0 
pragma solidity ^0.8.0; 
 
contract SimpleStorage { 
    uint256 private storedNumber; 
 
    // Funzione per salvare un numero 
    function set(uint256 _number) public { 
        storedNumber = _number; 
    } 
 
    // Funzione per recuperare il numero 
    function get() public view returns (uint256) { 
        return storedNumber; 
    } 
}