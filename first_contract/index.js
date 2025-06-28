import {
    Client,
    Hbar,
    PrivateKey,
    AccountId,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { createLogger } from '../util/util.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Pour obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = await createLogger({
    scriptId: 'transferHbar',
    scriptCategory: 'task',
});
let client;

async function Deploy_Smart_Contract() {
    logger.logStart('Hello Future World - Transfer Hbar - start');

    // Read in environment variables from `.env` file in parent directory
    dotenv.config({ path: '../.env' });
    logger.log('Read .env file');


    

    // Initialise the operator account
    const operatorIdStr = process.env.OPERATOR_ACCOUNT_ID;
    const operatorKeyStr = process.env.OPERATOR_ACCOUNT_PRIVATE_KEY;

    if (!operatorIdStr || !operatorKeyStr) {
        throw new Error('Must set OPERATOR_ACCOUNT_ID, OPERATOR_ACCOUNT_PRIVATE_KEY');
    }
    const operatorId = AccountId.fromString(operatorIdStr);
    const operatorKey = PrivateKey.fromStringECDSA(operatorKeyStr);
    logger.log('Using account:', operatorIdStr);

    // The client operator ID and key is the account that will be automatically set to pay for the transaction fees for each transaction
    client = Client.forTestnet().setOperator(operatorId, operatorKey);

    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));

    //Set the maximum payment for queries (in Hbar)
    client.setDefaultMaxQueryPayment(new Hbar(50));

    // Lire le fichier JSON avec fs
    const contractPath = join(__dirname, 'contract', 'contract.json');
    const contractData = JSON.parse(readFileSync(contractPath, 'utf8'));
    const bytecode = contractData.data.bytecode.object;

    //Create a file on Hedera and store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction()
        //Set the bytecode of the contract
        .setContents(bytecode)
        .freezeWith(client);
 
    //Signature de la transaction
    const signTx = await fileCreateTx.sign(operatorKey);

    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await signTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    //Log the file ID
    console.log("The smart contract byte code file ID is " + bytecodeFileId);

    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(bytecodeFileId)
        //Set the gas to instantiate the contract
        .setGas(100000)
        //Provide the constructor parameters for the contract
        .setConstructorParameters(new ContractFunctionParameters().addString("Hello from Hedera!"));

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

    //Get the smart contract ID
    const newContractId = contractReceipt.contractId;

    //Log the smart contract ID
    console.log("The smart contract ID is " + newContractId);
}

Deploy_Smart_Contract().catch(console.error);