<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
      <p class="mb-0 mr-4">{{account.balance}} POM</p>
      <v-btn v-if="!account.address" color="yellow" @click="connectWallet()">
        <span style="color:black">Connect</span>
      </v-btn>
      <v-btn v-else color="green" style="width:100px;">
        <span class="px-3 text-truncate" style="max-width:95px">{{account.address}}</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-btn icon @click.stop="clipped = !clipped">
            <v-icon>mdi-application</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn icon @click.stop="fixed = !fixed">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn icon @click.stop="miniVariant = !miniVariant">
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { ethers } from "ethers";
// import web3 from 'web3';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-image-plus',
          title: 'Sell Digital Asset',
          to: '/create-item',
        },
        {
          icon: 'mdi-folder-multiple-image',
          title: 'My Digital Assets',
          to: '/my-assets',
        },
        {
          icon: 'mdi-view-dashboard-variant',
          title: 'Creator Dashboard',
          to: '/creator-dashboard',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'NFT Marketplace',
      account: {
        address: '',
        balance: 0
      },
      signer: null,
      provider: null
    }
  },
  async mounted() {
    this.getSigner();
    const accounts = await this.getAccounts();
    if (accounts.length) {
      this.connectWallet()
    }
  },
  methods:{
    getSigner() {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
    },
    async getAccounts() {
      const accounts = await this.provider.listAccounts();
      return accounts;
    },
    async connectWallet() {
      let addresses = null;
      let address = '';
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          addresses = await this.provider.send("eth_requestAccounts", []);
          address = addresses[0]
        } catch (e) {
          alert(e)
        }

      }else{
        alert("Please install MetaMask to use this dApp!");
        return
      }

      let balance = await this.provider.getBalance(address);
      balance = ethers.utils.formatEther(balance);
      balance = parseFloat(balance).toFixed(2)
      const connectedAccount = {
        address,
        balance
      }
      this.account = connectedAccount
    }
  }
}
</script>
