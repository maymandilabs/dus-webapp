const CONTRACT_ADDRESS = "0x34f39Ad45Bc6C117A6C8480ef8540092868eA913";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "givenId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "givenURL",
				"type": "string"
			}
		],
		"name": "setURL",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"name": "dbIds",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "url",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isValue",
						"type": "bool"
					}
				],
				"internalType": "struct DUS.data",
				"name": "urlId",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalURLs",
		"outputs": [
			{
				"internalType": "int256",
				"name": "total",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "givenId",
				"type": "string"
			}
		],
		"name": "getURL",
		"outputs": [
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "ids",
		"outputs": [
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isValue",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

module.exports = { CONTRACT_ADDRESS, CONTRACT_ABI };