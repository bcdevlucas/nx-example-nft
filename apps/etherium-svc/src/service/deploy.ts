import fs from 'fs-extra';
import path, { resolve } from 'path';
import { web3, web3Network } from './web3';
import circularJSON from 'circular-json';

function requireJson (path) {
  return JSON.parse(fs.readFileSync(resolve(__dirname, path), 'utf-8'));
}

const compiledContract = requireJson('assets/contracts/Message.json');

const deploy = async (myMessage) => {
  try {


    // set the receipt path
    const receiptPath = path.resolve("ethereum","receipt-"+web3Network+".json");
    console.log(`---------- receipt path -------- ${receiptPath}`);

    // deploying the contract with accounts[0]
    const accounts = await web3.eth.getAccounts();
    console.log(`Attempting to deploy from account , ${accounts[0]}`);

    /**
     * To deploy a new it requires contract interface and its bytecode
     * Both we get after compiling the smart contract
     * The compiled smart contract is saved in build folder in json
     */
    const result = await new web3.eth.Contract(compiledContract?.interface)
      .deploy({data: compiledContract?.bytecode, arguments: [myMessage]})
      .send({gas: 3000000, from: accounts[0]});
    console.log(`Contract deployed to ${result.options.address}`);

    // CircularJson is converting nested object into string which can be then saved as json
    const serialised = circularJSON.stringify(result.options);

    // save the receipt address in receipt path
    fs.writeJsonSync(receiptPath,result.options);

    console.log("receipt saved successfully");
    return await serialised;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default deploy;
