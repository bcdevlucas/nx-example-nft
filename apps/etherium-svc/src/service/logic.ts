import fs from 'fs-extra';
import { resolve } from 'path';
import { web3 } from './web3';

function requireJson (path) {
  return JSON.parse(fs.readFileSync(resolve(__dirname, path), 'utf-8'));
}

const compiledContract = requireJson('assets/contracts/Message.json');

const getContractObject = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const contractReceipt = requireJson('./receipt-ganache.json');
  // create a contract object/instance
  const contractObject = new web3.eth.Contract(
    compiledContract?.interface,
    contractReceipt?.address
  );

  return contractObject;
};

const setMessage = async (newMessage) => {
  const accounts = await web3.eth.getAccounts();
  const contractObject = getContractObject();
  const receipt = await contractObject.methods
                    .setMessage(newMessage)
                    .send({from : accounts[0], gas:1000000});
  console.info(receipt);
  console.info("Message successfully saved!");
  return receipt;
};

const getMessage = async () => {
  const contractObject = getContractObject();
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
                   .getMessage()
                   .call({from:accounts[0]});
  console.log(result);
  return result;
};

export {
  setMessage,
  getMessage
};
