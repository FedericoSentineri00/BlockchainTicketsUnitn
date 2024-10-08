// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract ListStorage {

    uint64[] public numbers;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function add(uint64 num) public {
        numbers.push(num);
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieveByPos(uint16 index) public view returns (uint64){
        if (index < numbers.length){
            return numbers[index];
        }
        return type(uint64).max;
        
    }

    function removeByPos(uint16 index) public {
        
        require(index < numbers.length, "Index out of bounds");

        // Sposta l'ultimo elemento nella posizione da rimuovere
        numbers[index] = numbers[numbers.length - 1];

        // Rimuovi l'ultimo elemento
        numbers.pop();
    }


    function retrieveAll() public view returns (uint64[] memory){
        return numbers;
    }

    function getLength() public view returns  (uint64) {
        return (uint64)(numbers.length);
    }
}