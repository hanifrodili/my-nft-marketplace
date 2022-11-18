<template lang="pug">
div.pa-10.d-flex.justify-center.flex-column.mx-auto(style="max-width:800px; width:100%")
  h2.mb-5 Create Asset
  v-text-field(type="text" label="Asset Name" outlined v-model="formInput.name")
  v-textarea(label="Asset Description" outlined v-model="formInput.description")
  v-text-field(type="number" label="Asset Price in ETH" outlined v-model="formInput.price")
  v-file-input(type="file" label="Asset" outlined @change="uploadFile()" v-model="rawFile")
  img.d-flex.mx-auto.mb-10(v-if="fileUrl"  :src="fileUrl" :alt="fileName" style="max-width:400px; width:100%;")
  v-btn(:disabled="!fileUrl" width="100%" color="green"  @click="createMarket()" ) Create
       
</template>

<script>
import { ethers } from "ethers";
// import web3 from 'web3';
// import axios from "axios";
// import { create as ipfsHttpClient } from "ipfs-http-client";

// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config.json";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

export default {
  name: 'CreateItem',
  data() {
    return {
      rawFile: null,
      fileUrl: null,
      fileName: '',
      formInput: {
        price: "",
        name: "",
        description: "",
      },
      provider: null,
      signer: null
    }
  },
  async mounted() {
    this.getSigner();
    const accounts = await this.getAccounts();
    if (!accounts.length) {
      this.$router.push("/");
    }
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
    async uploadFile() {
      // console.log(this.rawFile);
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGJiZkFDMEQxNkZmRjViN2JFNGQ2MjhCOWJDOUYxNDgzRDU1MDU5MkYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODQzMjk2MDY3OCwibmFtZSI6IkRldiBQb21lbWUifQ.L5gm6UUttquBV2ODHOcp_Ae_Cynoc0Vx6XaoJ26Tzto';
      const imageData = new FormData()
      imageData.append('file', this.rawFile);
      await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        body: imageData,
        headers: {
          accept: 'application/json',
          authorization: 'Bearer ' + token,
          contentType: 'multipart/form-data'
        }
      })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        this.fileUrl = `https://nftstorage.link/ipfs/${result.value.cid}/${result.value.files[0].name}`;
        this.fileName = result.value.files[0].name;
      })
      .catch((error) => {
        console.error('Upload error:', error);
        error = true
      });
    },
    async createMarket() {
      const { name, description, price } = this.formInput;
      if (!name || !description || !price || !this.fileUrl) return;
      /* first, upload to IPFS */
      const data = JSON.stringify({
        name,
        description,
        image: this.fileUrl,
      });
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGJiZkFDMEQxNkZmRjViN2JFNGQ2MjhCOWJDOUYxNDgzRDU1MDU5MkYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODQzMjk2MDY3OCwibmFtZSI6IkRldiBQb21lbWUifQ.L5gm6UUttquBV2ODHOcp_Ae_Cynoc0Vx6XaoJ26Tzto';
      const formData = new FormData()
      formData.append('meta', data);
      await fetch('https://api.nft.storage/store', {
        method: 'POST',
        body: formData,
        headers: {
          accept: 'application/json',
          authorization: 'Bearer ' + token,
          contentType: 'multipart/form-data'
        }
      })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        const url = `https://nftstorage.link/ipfs/${result.value.ipnft}/metadata.json`;
        this.createSale(url);
      })
      .catch((error) => {
        console.error('Upload error:', error);
        error = true
      });
    },
    async createSale(url) {
      const signer = this.signer;

      /* next, create the item */
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.createToken(url);
      const tx = await transaction.wait();
      const event = tx.events[0];
      const value = event.args[2];
      const tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(this.formInput.price, "ether");

      /* then list the item for sale on the marketplace */
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
        value: listingPrice,
      });
      await transaction.wait();
      this.$router.push("/");
    }
  }
}
</script>
