import Web3 from "web3";
const config = require("../config.js");

var activeAgents = {
    "acc1": "free",
    "acc2": "free",
    "acc3": "free"
};

const web3 = new Web3("https://polygon-rpc.com");
const DUSContract = new web3.eth.Contract(config.CONTRACT_ABI, config.CONTRACT_ADDRESS);

/**
 * Returns the URL based on a given id
 * @param {string} id The shortened URL ID
 * @return {Promise<string>} The URL for the given ID is returned. If the ID is invalid, "N/A" is returned.
 */
async function getURL(id){
    try {
        var url = await DUSContract.methods.getURL(id).call();
        return url;
    } catch (e){
        return "N/A";
    }
}

/**
 * This function shortens a URL. It generates a random ID for the URL, records the ID in the smart contract, and then returns that id.
 * This function does ensure that the ID that is generated is unique. Note that the generated id will always start with "c" since this URL
 * is currently stored in the Polygon network.
 * @param {string} url The URL to be shortened 
 * @return {Promise<string>} The shortened URL's id
 */
async function shortenURL(url){
	var agent = getFreeAgent();
	if (agent == "N/A"){
		return "N/A";
	}
	activeAgents[agent] = "locked";
	
	var privateKey = getPrivateFromAgent(agent);
    var acc = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(acc);
    web3.eth.defaultAccount = acc.address;

	var id = await generateUniqueId();
    await DUSContract.methods.setURL(id, url).send({from: acc.address, gas: 227079, gasPrice: 194219599216});
	
	activeAgents[agent] = "free";

    return "p" + id;
}

/**
 * Retireves a free agent.
 * @return {string} Returns the agent account number "acc1" or returns "N/A" meaning there are no free agents.
 */
function getFreeAgent(){
	var keys = Object.keys(activeAgents);
	for (var i = 0; i < keys.length; i++){
		if (activeAgents[keys[i]] == "free"){
			return keys[i];
		}
	}
	return "N/A";
}

/**
 * Retireves the private key of a given agent.
 * @param {string} agent The account number "acc1"
 * @returns {string} Returns the private key or "N/A" if the account is not found
 */
function getPrivateFromAgent(agent){
	if (agent == "acc1"){
		return process.env.ACCOUNT1;
	} else if (agent == "acc2"){
		return process.env.ACCOUNT2;
	} else if (agent == "acc3"){
		return process.env.ACCOUNT3;
	}
	return "N/A";
}

/**
 * This function generates a random ID for a URL based on a provided length.
 * @param {number} length The length of the ID
 * @return {number} Returns a randomly generated ID
 */
function generateId(length) {
    var chars = "aAbBcCdD9eEfFg3GhHiI4jJkKlLmM5n0NoOpPqQr2RsStTu16UvVwW7xXyY8zZ"
    var id = "";
    for (var i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * 62)];
    }
    return id;
}

async function generateUniqueId(){
	var id = "N/A";
	while (id == "N/A"){
        id = generateId(6);
        if (await getURL("p" + id) != "N/A"){
            id = "N/A";
        }
    }
	return id;
}

module.exports = { getURL, shortenURL };