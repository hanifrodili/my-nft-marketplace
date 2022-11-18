<template lang="pug">
div.pa-10
  h1.mb-5 My Assets
  h3.text-center(v-if="loadingState === 'loaded' && !nfts.length")
    |You've no assets yet. 
    a(href="/create-item") Create now
  //- div.d-flex.row.w-full-width.justify-space-between
  //-   v-card.mb-6(v-for="n in 8" :key="n")
  //-     img(:src="'https://via.placeholder.com/350'" alt="NFT")
  //-     v-card-title Test
  //-     v-card-text
  //-       p Description
  //-     v-card-actions.d-flex.justify-end.pa-4.pt-0
  //-       v-btn(color="green" @click="buyNft()" ) Buy

  div.d-flex.flex-row(style="max-width:1024px; width:100%; gap:20px")
    v-card.mb-6(v-for="(nft, index) in nfts" :key="index" style="max-width:300px; width:100%")
      div.overflow-hidden.d-flex.align-center.justify-center(style="background-color: white; height:300px")
        img(:src="nft.image ? nft.image : 'https://via.placeholder.com/350'" alt="NFT" style="width:100%")
      v-card-title {{nft.name}}
      v-card-text
        p {{nft.description}}
      v-card-actions.d-flex.justify-end.align-center.pa-4.pt-0
        p.mb-0.mr-3 {{nft.price}} ETH
    
</template>

<script>
import { ethers } from "ethers";
// import web3 from 'web3';
import axios from "axios";

import { nftaddress, nftmarketaddress } from "../config.json";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

export default {
  name: 'IndexPage',
  data() {
    return {
      nfts: [],
      loadingState: "not-loaded",
      signer: null,
      provider: null
    }
  },
  async mounted() {
    this.getSigner();
    const accounts = await this.getAccounts();
    if (!accounts.length) {
      this.$router.push("/");
    }
    this.loadNFTs()
  },
  methods: {
    getSigner() {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
    },
    async getAccounts() {
      const accounts = await this.provider.listAccounts();
      return accounts;
    },
    async loadNFTs() {

      // console.log("provider:", provider);

      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, this.provider);
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        this.provider
      );
      const data = await marketContract.fetchMyNFTs();

      /*
      *  map over items returned from smart contract and format
      *  them as well as fetch their token metadata
      */
      //  console.log(data);
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          const price = await ethers.utils.formatUnits(i.price.toString(), "ether");
          const item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );
      // console.log(items);
      this.nfts = items
      this.loadingState = "loaded";
    },
  },
}
</script>
