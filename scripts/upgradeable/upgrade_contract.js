const { ethers, upgrades } = require('hardhat');
const { nftmarketaddress } = require('../../config.json');

async function main () {
  //specify updated contract.
  const updatedContractFile = "Marketplace";
  const Contract = await ethers.getContractFactory(updatedContractFile); 
  console.log(nftmarketaddress);
  //specify the address of proxy contract from when contract deployed.
  const proxyAddress = nftmarketaddress;

  console.log('Upgrading contract...');
  await upgrades.upgradeProxy(proxyAddress, Contract);
  
  console.log('Contract upgraded');
}

main();