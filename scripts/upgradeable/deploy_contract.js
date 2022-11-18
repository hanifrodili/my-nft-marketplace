const { ethers, upgrades } = require('hardhat');

async function main () {
 console.log("================== Marketplace Contract ==================");
  //specify contract to deploy.
  const marketplaceContract = "Marketplace"
  const MarketplaceContract = await ethers.getContractFactory(marketplaceContract);

  console.log('Deploying contract...');
  const contractMarketplace = await upgrades.deployProxy(MarketplaceContract);

  await contractMarketplace.deployed();
  console.log(`${marketplaceContract} contract deployed to proxy contract at ${contractMarketplace.address}`);
  console.log('Use address above for contract upgrade.');

  console.log("====================== NFT Contract ======================");

  //specify contract to deploy.
  const nftContract = "NFT"
  const NftContract = await ethers.getContractFactory(nftContract);

  console.log('Deploying contract...');
  const contractNft = await NftContract.deploy(contractMarketplace.address);

  await contractNft.deployed();
  console.log(`${nftContract} contract deployed to ${contractNft.address}`);
  // console.log('Use address above for contract upgrade.');
}

main();