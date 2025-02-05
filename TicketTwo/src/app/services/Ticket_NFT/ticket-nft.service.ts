import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ConnectionService } from '../Connection/connection.service';
import { FactoryService } from '../Factory/factory.service';
import { EventDetails } from '../../classes/EventDetail';
import { TicketDetails } from '../../classes/TicketDetails';
import { SecotrDetails } from '../../classes/SectorDetails';


const contract_ticket_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_organization_name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_organizer",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC1155InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC1155InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idsLength",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "valuesLength",
				"type": "uint256"
			}
		],
		"name": "ERC1155InvalidArrayLength",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC1155InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC1155InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC1155InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC1155MissingApprovalForAll",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "EventCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sectorId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "SectorCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "sectorId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "TicketCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "TransferBatch",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "TransferSingle",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "value",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "URI",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ORGANIZER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_organizer",
				"type": "address"
			}
		],
		"name": "addOrganizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "groupId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "addParticipant",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "ticket_ids",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "seats",
				"type": "string[]"
			}
		],
		"name": "assignSeats",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "accounts",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			}
		],
		"name": "balanceOfBatch",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_time",
				"type": "uint256"
			}
		],
		"name": "createEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "createGroup",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_totalSeats",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_seat_x_lines",
				"type": "uint256"
			}
		],
		"name": "createSector",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sectorId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_originalPrice",
				"type": "uint256"
			}
		],
		"name": "createTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "eventCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "events",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sectorCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "exists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			}
		],
		"name": "expireTickets",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "str",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "generateHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllEventsDetails",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "names",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "times",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "sectorCounts",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "availableSeats",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			}
		],
		"name": "getEventDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sectorCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "availableSeats",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "groupId",
				"type": "uint256"
			}
		],
		"name": "getGroupTickets",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sectorId",
				"type": "uint256"
			}
		],
		"name": "getSector",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalSeats",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "availableSeats",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "ticketIds",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "associatedGroupIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "getTicket",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sectorId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "groupId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "originalPrice",
				"type": "uint256"
			},
			{
				"internalType": "enum Ticket_NFT.TicketStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "seat",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "hashName",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_end",
				"type": "uint256"
			}
		],
		"name": "getTickets",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "eventId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sectorId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "groupId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "originalPrice",
						"type": "uint256"
					},
					{
						"internalType": "enum Ticket_NFT.TicketStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "seat",
						"type": "string"
					},
					{
						"internalType": "bytes32",
						"name": "hashName",
						"type": "bytes32"
					}
				],
				"internalType": "struct Ticket_NFT.Ticket[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "groupCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "groups",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "isTicketInGroup",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "organization_name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_organizer",
				"type": "address"
			}
		],
		"name": "removeOrganizer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "groupId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "removeParticipant",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "values",
				"type": "uint256[]"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeBatchTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "surname",
				"type": "string"
			}
		],
		"name": "setOwnerName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "_interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ticketCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sectorId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "groupId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "originalPrice",
				"type": "uint256"
			},
			{
				"internalType": "enum Ticket_NFT.TicketStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "seat",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "hashName",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"internalType": "enum Ticket_NFT.TicketStatus",
				"name": "newStatus",
				"type": "uint8"
			}
		],
		"name": "updateTicketStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "uri",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "surname",
				"type": "string"
			}
		],
		"name": "validateTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

@Injectable({
  providedIn: 'root'
})
export class TicketNFTService {
	
  	private contract: ethers.Contract | undefined;
	private contract_ticket_Address: string = '';

  	constructor(private connection: ConnectionService, private factoryService: FactoryService) { 
		this.initializeContract();
  }

  private async initializeContract(): Promise<void> {
    try {
		await this.connection.connect();
      const organizerAddress = await this.connection.getSignerAddress();
	  console.log("organizerAddress:",organizerAddress);
      this.contract_ticket_Address = await this.factoryService.getOrganizerNFT(organizerAddress);
	  console.log("contract_ticket_Address:",this.contract_ticket_Address);

	  const provider = this.connection.getProvider();
      const signer = provider.getSigner();


      this.contract = new ethers.Contract(this.contract_ticket_Address, contract_ticket_ABI, await signer);
      console.log(`Contract initialized with address: ${this.contract_ticket_Address}`);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  }

  getContractAddress(): string {
	return this.contract_ticket_Address; // Return the contract address
	}


	
	async getOrganizerNFT(): Promise<String> {
		const organizerAddress=await this.connection.getSignerAddress();
		const nftAddress = await this.factoryService.getOrganizerNFT(organizerAddress);
		console.log(`NFT Address for organizer ${organizerAddress}:`, nftAddress);
		return nftAddress
	}




  // ----- MANAGEMENT EVENTS -----

  //Function for the creation of a new event
  async createEvent(name: string, time: number): Promise<number> {
		if(!this.contract){
			throw new Error('Contract not initialized');
		}
		console.log("Arrivo qua");
		
		const tx = await this.contract['createEvent'](name, time);
		const receipt = await tx.wait();
		console.log("Arrivo anche qua");
		console.log("Receipt", receipt);
		const eventId = receipt.logs[0].args[0].toString();
		console.log("Arrivo anche anche qua");
		console.log(`Evento creato con ID: ${eventId}`);
		return parseInt(eventId);
	}

  //Function for retreive an event based on its id
  async getEventDetails(eventId: number): Promise<EventDetails> {
	if(!this.contract){
		throw new Error('Contract not initialized');
	}
		const details = await this.contract['getEventDetails'](eventId);  
		return new EventDetails(
			details[0], 
      		details[1].toString(),
			new Date(details[2] * 1000),       
			details[3],
      		details[4]
    	);
	}

	//resituisce un evento e un array di settory e i biglietti id
	async getEventInfo(eventId: number): Promise<{ event: EventDetails, sectors: SecotrDetails[] }>{
		if(!this.contract){
			throw new Error('Contract not initialized');
		}
		
		const eventDetailsRaw = await this.contract['getEventDetails'](eventId); 

		const eventTime = Number(eventDetailsRaw[2]);
		const totAvailableSeats = Number(eventDetailsRaw[4]);
		const sectorCount = Number(eventDetailsRaw[3]);
		const eventDetails = new EventDetails(
			eventDetailsRaw[0], 
			eventDetailsRaw[1].toString(),
			new Date(eventTime * 1000),      
			sectorCount,
			totAvailableSeats
		);

		const sectors: SecotrDetails[] = [];

		for (let sectorId = 1; sectorId <= sectorCount; sectorId++) {
			const secotrDetailsRaw = await this.contract['getSector'](eventId, sectorId);  

			const sectorDetails = new SecotrDetails(
				secotrDetailsRaw[0],         
				secotrDetailsRaw[1].toString(),
				secotrDetailsRaw[2],       
				secotrDetailsRaw[3],
				secotrDetailsRaw[4],
				secotrDetailsRaw[5]
			);

			sectors.push(sectorDetails);
		}

		return {
			event: eventDetails,
			sectors: sectors
		};

			
	}

	async getAllEventsDetails(): Promise<EventDetails[]> {
		const events: EventDetails[] = [];

		let nextNFTId= await this.factoryService.getnextNFTId();
		
		for (let organizerId=0; organizerId<nextNFTId; organizerId++){
			try {
				const organizationAddress = await this.factoryService.getOrganizationAddress(organizerId);
				console.log(`Organization Address for ID ${organizerId}:`, organizationAddress);

				const nftContractAddress = await this.factoryService.getOrganizerNFT(organizationAddress);
				console.log(`NFT Contract Address for organizer at ${organizationAddress}:`, nftContractAddress);


				const provider = this.connection.getProvider();
				const signer = provider.getSigner();
				const organizerContract = new ethers.Contract(nftContractAddress, contract_ticket_ABI, await signer);

				const details = await organizerContract['getAllEventsDetails']();

				for (let i = 0; i < details[0].length; i++) {
					const eventTime = Number(details[2][i]);
					const totAvailableSeats = Number(details[4][i]);
					const sectorCount = Number(details[3][i]);
					const event = new EventDetails(
					  details[0][i],                                
					  details[1][i].toString(),                     
					  new Date(eventTime * 1000),   
					  sectorCount, 
					  totAvailableSeats,                                                                
					);

					console.log("event gu",event)
					events.push(event);
				  }
			}catch(error){
				console.error(`Error processing organizer ID ${organizerId}:`, error);
			}
		}
		return events;
	}

	async getMyTickets(): Promise<TicketDetails[]> {
		const tickets: TicketDetails[] = [];

		let nextNFTId= await this.factoryService.getnextNFTId();
		
		for (let organizerId=0; organizerId<nextNFTId; organizerId++){
			try {
				const organizationAddress = await this.factoryService.getOrganizationAddress(organizerId);
				console.log(`Organization Address for ID ${organizerId}:`, organizationAddress);

				const nftContractAddress = await this.factoryService.getOrganizerNFT(organizationAddress);
				console.log(`NFT Contract Address for organizer at ${organizationAddress}:`, nftContractAddress);


				const provider = this.connection.getProvider();
				const signer = provider.getSigner();
				const organizerContract = new ethers.Contract(nftContractAddress, contract_ticket_ABI, await signer);

				const maxid =await organizerContract['getnextTicketCount']();
				
				for (let ticketId = 0; ticketId <= maxid; ticketId++) {
					const balance = await organizerContract['balanceOf'](signer , ticketId);
					if (balance > 0) {
						const ticketinfo=await organizerContract['getTicket'](ticketId);
						tickets.push(ticketinfo)
					}
				}
			}catch(error){
				console.error(`Error processing organizer ID ${organizerId}:`, error);
			}
		}
		return tickets;
	}


	async getMyEvents(): Promise<EventDetails[]> {
		

		if(!this.contract){
			throw new Error('Contract not initialized');
		}
		console.log("Arrivo qua");

		const events: EventDetails[] = [];
	
		const details = await this.contract['getAllEventsDetails']();

		for (let i = 0; i < details[0].length; i++) {
			const eventTime = Number(details[2][i]);
			const totAvailableSeats = Number(details[4][i]);
			const sectorCount = Number(details[3][i]);
			const event = new EventDetails(
				details[0][i],                                
				details[1][i].toString(),                     
				new Date(eventTime * 1000),   
				sectorCount, 
				totAvailableSeats,                                                                
			);

			console.log("My events taken",event)
			events.push(event);
			}
			
		return events;
	}
	

  // ----- MANAGEMENT SECTORS -----

  //Function for the creation of a new sector
  async createSector(eventId: number, name: string, lines : number , seat_x_lines : number): Promise<number> {
	if(!this.contract){
		throw new Error('Contract not initialized');
	}
		const tx = await this.contract['createSector'](eventId, name, lines*seat_x_lines, seat_x_lines);
		const receipt=await tx.wait();
		const sectorId = receipt.logs[0].args[1].toString();
		console.log(`Settore creato per id ${sectorId}: ${name}`);
		return parseInt(sectorId);

	}

  //Funtion to ge the details of a specific sector by its id in a event
  async getSectorDetails(eventId: number, sectorId:number): Promise<SecotrDetails> {
	if(!this.contract){
		throw new Error('Contract not initialized');
	}
		const details = await this.contract['getSectorDetails'](eventId, sectorId);  
		return new SecotrDetails(
			details[0],         
			details[1].toString(),
			details[2],       
			details[3],
      		details[4],
      		details[5]
    	);
	}


	async createTicket(eventId: number, sectorId: number, originalPrice: number): Promise<number> {
		if(!this.contract){
			throw new Error('Contract not initialized');
		}
			const tx = await this.contract['createTicket'](eventId, sectorId, originalPrice);
			const receipt=await tx.wait();
			const ticketId = receipt.logs[0].args[0].toString();
			console.log(`Ticket creato con id ${ticketId}`);
			return parseInt(ticketId);
	
	}




	//function to add and remove organizer
	async addOrganizer(organizerAddress: string): Promise<void> {
		if (!this.contract) {
		  throw new Error('Contract not initialized');
		}
		
		const tx =await this.contract['addOrganizer'](organizerAddress);
		const receipt =await tx.wait();
		console.log("Receipt", receipt);
		console.log(`Organizer ${organizerAddress} successfully added.`);
	}

	async removeOrganizer(organizerAddress: string): Promise<void> {
		if (!this.contract) {
		  throw new Error('Contract not initialized');
		}
		
		
		const tx =await this.contract['removeOrganizer'](organizerAddress);
		const receipt =await tx.wait();
		console.log("Receipt", receipt)
		console.log(`Organizer ${organizerAddress} successfully removed.`);
	}
	  
	  




}
