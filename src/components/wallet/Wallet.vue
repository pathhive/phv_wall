<template>
    <div class="user-page-box">
        <div class="user_page_title_box">
            <img src="../../common/images/qrimg.png" alt="" v-show="qrImguse">
            <img v-bind:src="qrImgUrl" alt="Not Empty Qr" v-show="qrImgNotuse">
        </div>
        <div class="addressBox">
            <p class="addressTitle">Wallet Address</p>
            <p class="addressText"><span>{{formatAddress}}</span></p>
        </div>
        
        <div class="tableBox top">
            <div class="subBox">
                <p class="phvDiv">
                    <span class="walletTitle">Total Balance</span> <span @click="showCoin(PHV)" class="walletInfo">{{formatPHV}} PHV</span> 
                </p>
                <p class="lockedDiv">
                    <span class="walletTitle">Transferable</span> <span @click="showCoin(LockedPHV)" class="walletInfo">{{formatLockedPHV}} PHV</span> 
                </p>
            </div>
        </div>
        <div class="tableBox bottom">
            <div class="subBox">
                <p>
                    <span class="walletTitle">Trandsferable</span><span @click="showCoin(ETH)" class="walletInfo">{{formatETH}} ETC</span>
                </p>
            </div>
        </div>                                         
        <div class="main_btn_box" v-show="btnType">
            <div class="sub_btn_box">   
                    <span type="submit" id="btn_wallet_regiset"  @click="showModal('modalShow')" class="btn btn-alt wallet_btn">Regiset Wallet</span>
            </div>    
        </div>
    </div> 
</template>

<script>
import { eventBus } from '../../main.js';

var formatdata = function (str,type){
    let formatStr = '';
    if(type === 'address'){
        formatStr = str.substring(0,23)+'...';
    }else{
        if(str.length > 7){
            formatStr = str.substring(0,6)+'...';
        }else{
            formatStr = str;
        } 
    }
    return formatStr;
}
export default {

    data() {
        return {
            qrImgNotuse : false,
            qrImguse : false,
            qrImgUrl : '',
            btnType : false,
            Address : 0,
            PHV : 0,
            LockedPHV : 0,
            ETH : 0,
            formatAddress : '',
            formatPHV : '',
            formatLockedPHV : '',
            formatETH : '',
        }
    },
    methods :{
       showModal : function(type){
           eventBus.$emit('event',type);
       },
       walletLoad (){
            var keyName = this.$store.state.keyName;
            function getToken(callback){
                return new Promise(function(resolve,reject){
                    getAccessToken(keyName,function(res){
                        if(res){
                            resolve(res);
                        }
                        else{
                            reject(new Error('TokenError'));
                        }
                    })
                })
            }
            getToken().then((accessToken)=>{
                this.$store.dispatch('WALLET',{accessToken})
                .then(() =>{   
                    if(this.$store.state.walletInfo.success){
                        this.qrImgNotuse = true,
                        this.qrImguse = false,
                        this.qrImgUrl = this.$store.state.walletInfo.qr_code,
                        this.btnType = false,
                        this.Address=this.$store.state.walletInfo.address,
                        this.PHV=this.$store.state.walletInfo.phv,
                        this.LockedPHV=this.$store.state.walletInfo.transferable,
                        this.ETH=this.$store.state.walletInfo.eth,
                        this.formatAddress = formatdata(this.$store.state.walletInfo.address,'address'),
                        this.formatPHV = formatdata(this.$store.state.walletInfo.phv,'phv'),
                        this.formatLockedPHV = formatdata(this.$store.state.walletInfo.transferable,'transferable'),
                        this.formatETH = formatdata(this.$store.state.walletInfo.eth,'eth')
                    }else{
                        this.qrImguse = true,
                        this.btnType = true,
                        this.Address=0,
                        this.PHV=0,
                        this.LockedPHV=0,
                        this.ETH=0
                    }
                })
            .catch(({message}) => {
                eventBus.$emit('event','error');
                })
            }).catch((error) => {
                eventBus.$emit('event','error');     
            })         
       },
       showCoin (totalCoin){
           toastShort(totalCoin);
       }
    },
   /* watch : {
        Address : function(callback){
            return formatString(this.Address,(formatData)=>{
                callback = formatData;
            })
        }
    },*/
    mounted(){
        eventBus.$emit('backStatus',false);   
        eventBus.$on('newWalletLoad',this.walletLoad);              
    },
    created(){
        this.walletLoad();
    }
    

}
</script>