<template>
    <section class="user-page d-flex align-items-center">
      <Header v-show="back_btn_check"></Header>
      <div class="container" id="userMain">
        <!--<router-view v-on:eventBus="Listevent"></router-view>-->
        <router-view></router-view>
      </div>
       <!--<Footer v-bind:event="eventBus"></Footer>-->
       <!--레이어팝업-->
        <div class="popup_mask" v-bind:class ="{useactive : maskValue}"></div>
        <vue-circle ref="circleLoading" v-bind:style="{display : disStatus}"
                :progress="100"
                :size="50"
                :reverse="false"
                line-cap="round"
                empty-fill="rgba(0, 0, 0, .1)"
                :fill = fill
                :animation-start-value="0.0"
                :start-angle="0"
                insert-mode="append"
                :thickness="5"
                :show-percent="false"
                @vue-circle-progress="progress"
                @vue-circle-end="progress_end">
        </vue-circle>
            <!--알림창 추가예정-->
            <!--
                추가
                성공 팝업 div 추가
            -->
            <div class="eventPopup" v-show="eventPopupCheck">
                <div class="eventPopupMsgBox">
                    <span class="popupMsg">{{eventPopupMsg}}</span>
                </div>
                <div class="sub_wallet_btn_apply" v-show="completeShow">
                    <div class="single_Btn_box">
                        <span type="button" @click="eventChange('submit')">OK</span>
                    </div>               
                </div>
                <div class="sub_wallet_btn_apply" v-show="singleBtnShow">
                    <div class="single_Btn_box">
                        <span type="button" @click="eventChange('hideEventPopupSingle')">OK</span>
                    </div>               
                </div>
                <div class="sub_wallet_btn_apply" v-show="doubleBtnShow">
                    <div class="dobule_Btn_box">
                        <span type="button" @click="eventChange('hideEventPopupDobuleOK')">OK</span>
                    </div>
                    <div class="dobule_Btn_box">
                        <span type="button" @click="eventChange('hideEventPopupDoubleCancel')">CANCEL</span>
                    </div>                
                </div>
            </div>
           
            <div class="create_wallet_popup" v-bind:class ="{useactive : showValue}">
                <div class="sub_wallet_btn_box" @click="openScanner()"> 
                    <img src="./common/images/camera.png" alt="QR Camera">
                </div>
                <div class="sub_regist_box">
                    <p>
                        <span>Wallet Address</span>
                    </p>
                    <div class="input-box">
                        <input type="text" id="wallet_address" v-model="format_address" value="" readonly="readonly"/>
                    </div>
                </div>
                <div class="sub_wallet_btn_apply"> 
                    <div class="dobule_Btn_box">
                        <span type="button" class="btn btn-alt wallet_btn" @click="createWallet(new_wallet_address)">Apply</span>
                    </div>
                    <div class="dobule_Btn_box">
                        <span type="button" @click="eventChange('modalHide')" v-bind:style="{width:widthSize}" class="btn btn-alt wallet_btn">Cancel</span>
                    </div>
                </div>
        </div>
        <!--<div class="footerImgDiv">
            Copyrightⓒ2018 All rights reserved by PATHHIVE NETWORD
        </div>-->
    <Footer v-show="footerStatus"></Footer>
    </section>
</template>

<script>
import VueCircle from 'vue2-circle-progress-redraw'
import WalletHeaderVue from './components/WalletHeader'
import WalletFooterVue from './components/WalletFooter'
import { eventBus } from './main.js'

var formatdata = function (str){
    const formatStr = str.substring(0,28);
    return formatStr+'...';
}
var popupFormat = function(str){
    return str;
}
export default {
    data() {
        return {
            showValue  : false,
             fill : { gradient: ["#d9d9d9", "#d9d9d9", "#d9d9d9"] },
            maskValue : false ,
            disStatus : 'none',
            errMsg : '',
            back_btn : false,
            footerStatus : true,
            new_wallet_address : '',
            format_address : '',
            eventPopupCheck : false,
            eventPopupMsg : '',
            singleBtnShow : false,
            doubleBtnShow : false,
            completeShow : false,
            changeLocation : '',
        }
    },
    computed : {
      back_btn_check : function(){
          return this.back_btn
      }
    },
    watch: {
        new_wallet_address : function(data){
            this.format_address = formatdata(data)
        },
        eventPopupMsg : function(data){
            this.eventPopupMsg = popupFormat(data);
        }
    },
  methods : {
    eventChange(type) {
        if(type === 'modalShow'){
        this.showValue = true;
        this.maskValue = true;
        }
        else if(type === 'modalHide'){
          this.showValue = false;
          this.maskValue = false;
        }
        else if(type === 'loading'){
          this.maskValue = true;
          this.disStatus = 'block';
          this.$refs.circleLoading.redraw(); 
        }
        else if(type === 'error'){
            this.$router.push({
                 path: 'error'
            })
        }else if(type === 'hideEventPopupSingle'){
            this.maskValue = false,
            this.singleBtnShow = false,
            this.eventPopupCheck = false
        }else if(type === 'hideEventPopupDoubleCancel'){
            this.maskValue = false,
            this.doubleBtnShow = false,
            this.eventPopupCheck = false
        }else if(type === 'hideEventPopupDoubleOK'){
            this.maskValue = false,
            this.doubleBtnShow = false,
            this.eventPopupCheck = false
            //함수 호출 예정
        }else if(type === 'submit'){
            this.maskValue = false,
            this.completeShow = false,
            this.eventPopupCheck = false,
            this.goToPages(this.changeLocation)
        }

    },
        progress(event,progress,stepValue){

        //console.log(stepValue);
      },
      progress_end(event){
        if(this.errMsg === 'error'){
             this.$refs.circleLoading.redraw();
        } else{
            console.log("Circle progress end");
            this.maskValue = false,
            this.disStatus = 'none';
        }
      },
      backChange(status){
          this.back_btn = status;
          console.log(this.back_btn);
      },
      openScanner(){
           openQrScanner((address)=>{
             this.new_wallet_address = address;
           })
      },
      createWallet(newAddress){
        var keyName = this.$store.state.keyName;
        if(newAddress !== ''){
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
                    this.$store.dispatch('CREATEWALLET',{accessToken,newAddress})
                    .then(() =>{
                        var newAccessTokeSuccess = this.$store.state.newAddressToken.success
                        if(newAccessTokeSuccess){
                            var newToken = this.$store.state.newAddressToken.access_token
                            eventBus.$emit('loginToken',newToken,true);
                        }else{
                            this.eventPopupFuc('Not new Token');
                            //alert('Not new Token');
                        }
                    })
                .catch(({message}) => {
                    console.log('=====>'+message);
                    eventBus.$emit('event','error');
                    })
                }).catch((error) => {
                    console.log('확인'+error);
                    eventBus.$emit('event','error');     
                })
        }else{
           this.eventPopupFuc('Please search QR code'); 
        }  
      },
      eventPopupFuc(data){
        this.eventPopupMsg = data,
        this.maskValue = true,
        this.singleBtnShow = true,
        this.eventPopupCheck = true
      },
      compleatePopupFuc(data,location){
        this.eventPopupMsg = data,
        this.maskValue = true,
        this.completeShow = true,
        this.eventPopupCheck = true,
        this.changeLocation = location
      },
      goToPages (locationUrl) {
            this.$router.push({
            path: locationUrl
            })
        }  
  },    
 components : 
      {
       VueCircle,
      'Header' : WalletHeaderVue,
      'Footer' : WalletFooterVue,
      },
  created (){
    this.maskValue = true;
    this.disStatus = 'block';
    let cordobaScript = document.createElement('script') 
    cordobaScript.setAttribute('src', 'http://localhost/bridge/platforms/android/platform_www/cordova.js') 
    document.head.appendChild(cordobaScript) 
    let bridgescript = document.createElement('script') 
    bridgescript.setAttribute('src', 'http://localhost/bridge/www/js/index.js') 
    document.head.appendChild(bridgescript)
  },           
  mounted(){
    eventBus.$on('event',this.eventChange);
    eventBus.$on('backStatus',this.backChange);
    eventBus.$on('eventPopup',this.eventPopupFuc);
    eventBus.$on('completeEvent',this.compleatePopupFuc);
    console.log('app mounted');
  },
  beforeUpdate () {
      console.log('app beforeUpdate');
  },
  updated () {
    var thispath = ''+document.location.href ;
    console.log(thispath);
    this.$store.dispatch('WRITELOG',{thispath});
    document.addEventListener("backbutton", onBackKeyDown, false);
  }   
}
</script>

<style>
@font-face {
    font-family:'Helvetica Neue';
    src: url('./common/font/HelveticaNeue-Medium-11.ttf');
}
html, body { 
    overflow-x: hidden; 
    background-color: #F3F1F1; 
    margin: 0%; 
    overflow: hidden; 
    height: 100vh;
    font-family: 'Helvetica Neue';
    }
.header {
    
    position: fixed;
    z-index: 6;
    width: 100%;

}
/*
.footer{
    position:fixed;
    top:90%;
    left:0px;
    width:100%;
    height:100%;
}*/

@media only screen and (min-width: 1199px) and (max-width: 1440px) and (max-height: 700px) {
    .user-page-box {
        padding: 30px 60px;
    }
}
@media only screen and (max-height: 767px) {
    .user-page {
        height: auto;
        overflow-y: hidden;
        max-height: 100%;
    }
    .user-page-box h5 {
        margin-bottom: 20px;
    }
}
@media only screen and (max-width: 812px) and (orientation: landscape) {
    .user-page { height: auto;overflow-y : scroll; height: 100%; }
    .footer{ bottom: -5% !important; }
    .err-page-box{padding-top: 15% !important;}
}

/*.user-page {position: relative; height: 100vh;}*/
.user-page {position: absolute;height: 100%;width: 100%;}
.user-page-box { width: auto; margin: 0 auto; position: relative; /*height: 85vh;*/ height: auto; padding-top: 15%; }
.user_page_logo_box p{
    margin : 0%;
}

.container { position: relative; z-index: 5; min-height: 100vh; height: auto;}
.container.pd_container { padding:170px 0px; }

.user_page_logo_box{
    text-align: center;
    min-height: 15%;
}

.user_page_logo_box img{
    max-width: 40%;
    max-height: 40%;
}
.user_page_title_box{
    text-align: center;
    min-height: 15%;
}
.user_page_title_box img{
    max-width: 60%;
}
.user_page_title_box p{
    color: rgb(204, 204, 204);
}
/*에러페이지*/
.err-page-box { 
    width: auto; 
    margin: 0 auto;
    position: relative; 
    /*height: 85vh;*/ 
    height: auto; 
    padding-top: 65%; 
}
.error_page_title_box{
    text-align: center;
    min-height: 15%;
}
.error_page_title_box p{
    color: rgb(204, 204, 204);
}
.main_btn_box .err_btn_box{
    background : #F3911E;
    border-radius : 88px;
    font-size: 1.2em;
    line-height: 2.0em;
    color: rgb(255, 255, 255);
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
    
}

.spaceBarDiv{margin-bottom: 3%;}
.input-box{ 
    margin-top: 20px;
    padding:  0% 10% 0% 10%;
    position: static;
    text-align: center;
    padding-right: 10%;

}
.input-box label{text-align: left;font-size: 15px;}
.input-box input[type="text"],input[type="password"]{
    border-width: 0px !important;
    border-style: outset !important;
    font-size: 1.0em;
    border-radius : 88px;
    line-height: 2.0em;
    text-indent: 0.8em;
    width: 100%;
    font-family: Helvetica Neue !important;
    color: #000000;
    opacity : 0.5;
    box-shadow: 3px 5px 13px 1px  rgba(0,0,0,0.1);

    }


.disHide{
    display: none;
}
.disShow{
    display: block;
}
/*헤더*/
.headerLeft{
    float: left;
}
.headerLeft img {
    max-width: 22%;
    max-height: 20%;
}
.header{
    top: 3%;
    left: 3%
}
/*푸터*/
.footerImgDiv{
    /*padding: 10% 0 0 0;*/
    text-align: center;
    position: relative;
    background-image: url('./common/images/copyright_img.png');
    width: 100%;
    height: 100%;
    background-size: 30%;
}
.footerImgDiv img{
    max-width: 60%;
    max-height: 30%;
    /*padding-bottom: 10%*/
}
.footer{
    bottom: 7%;
    position: relative;
    font-size: 0.8em;
    text-align: center;
    width: 100%;
    line-height: 1.5em;
    text-align: center;
    color: rgb(204, 204, 204) !important
}
/*로그인화면*/
.main_login_box{
    min-height: 15%;
    padding:1% 0 0 0;
    }

.findMsgDiv{
    padding: 6.5% 0 0 0;
    text-align: center;
    
}
.routerlink{
    color: rgb(204, 204, 204) !important;
    text-decoration : none;
}

.main_btn_box{
    padding:  6.5% 10% 0% 10%;
    position: static;
    text-align:  center;
    padding-right: 10%;
}
.main_btn_box .sub_btn_box{
    background : #F3911E;
    border-radius : 88px;
    font-size: 1.2em;
    line-height: 2.0em;
    color: rgb(255, 255, 255);
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
    
}

.textBox{
    border-bottom: 1px solid grey;
}


/*지갑화면*/
.tableBox{
    padding: 0% 15% 0% 15%;
    min-height: 10%;
    line-height: 2.0em;
    text-indent: 0.8em;
    color: rgb(204, 204, 204);    
}
.tableBox.bottom{
    padding-top : 1%;
}/*
.tableBox.bottom div{
    width: 100%;
}*/
.tableBox .subBox{
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
    padding: 0 5% 0 5%;
    border-radius : 12px;

}

.tableBox .phvDiv{
    margin-bottom: 2%;
}
.tableBox .lockedDiv{
    border-top : 1px solid #d9d8d8;
    margin-top: 5%;
    padding-bottom : 1%;
}
.main_wallet_btn_box{
    max-width: 100%;
    margin-top: 20%;
    text-align: center;
}
.tableBox .subBox .walletInfo{
    float: right;
}
.circle{
    display: none;
    position: absolute !important;
    top: 35%;
    left: 5%;
    right: 5%;
    width: 80%;
    height: auto;
    padding: 16px;
    z-index: 1001;
    overflow: hidden;
    text-align:center;
}
.addressBox{
    padding: 0% 15% 0% 15%;
    text-align: center;
}
.addressBox p {
    color:  rgb(204, 204, 204);
}
.addressTitle{
    text-align: left;
    text-indent: 0.8em;
    font-size: 1.2em;

}
.addressBox .addressText{
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
    font-size: 1.0em;
    /* opacity: 0.4; */
    border-radius: 88px;
    line-height: 2.0em;
    text-indent: 0.8em;
}
/*팝업*/
.popup_mask{
    display: none;
	position: absolute;
	top: 0%;
	left: 0%;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.25);
	z-index:1002;
	-moz-opacity: 0.8;
	opacity:.80;
	filter: alpha(opacity=80);
}
.eventPopupMsgBox{
    text-align: center;
    padding: 1% 10% 1% 10%;
}
.eventPopupMsgBox .popupMsg{
    font-family: Helvetica Neue !important;
    font-size: 1.3em;
    word-break: break-word;
    color: rgb(204, 204, 204);

}
.eventPopup{
    position: absolute;
    top: 40%;
    left: 5%;
    right: 5%;
    width: 78%;
    height: auto;
    padding: 5%;
    background-color: #F3F1F1;
    z-index: 1004;
    overflow: hidden;
    text-align:center;
    border-radius: 0.65em;
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
}


.create_wallet_popup{
    display: none;
    position: absolute;
    top: 10%;
    left: 5%;
    right: 5%;
    width: 80%;
    height: auto;
    padding: 16px;
    background-color: #F3F1F1;
    z-index: 1003;
    overflow: hidden;
    text-align:center;
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);

}
.sub_wallet_btn_box{
    width: 100%;
    padding: 10% 0 0 0;
 }
 .sub_wallet_btn_box img{
    max-width: 70%;
 }
.create_wallet_popup .sub_regist_box input{ 
    width: 100%;
    font-size: 13px;
}

.sub_regist_box{
    height: 25%;
    padding-top: 10%;
    text-align: center;
}
.sub_regist_box p{
     color:  rgb(204, 204, 204);
}
 .sub_wallet_btn_apply{
    height: 25%;
    padding: 15% 0 0 0;
}
.sub_wallet_btn_apply .dobule_Btn_box{
    background : #F3911E;
    border-radius : 88px;
    font-size: 1.2em;
    line-height: 3.0em;
    color: rgb(255, 255, 255);
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
    width: 40%;
    float: left;
    margin-left: 7%;
}

.sub_wallet_btn_apply .single_Btn_box{
    background : #F3911E;
    border-radius : 88px;
    font-size: 1.2em;
    line-height: 3.5em;
    color: rgb(255, 255, 255);
    box-shadow: 3px 5px 13px 0px rgba(0,0,0,0.1);
    width: 50%;
    text-align: center;
    margin-left: 25%;
}

/*이메일인증 비번찾기*/
.btn_email_box{
    text-align: center;
}
.btn_email_box .main_btn_box{
    margin-top: 5%;
}
.find_email_box{
    margin-top: 20%
}
/*비빌번호 변경*/
.pw_change_box{
    margin-top: 20%;
}
.btn_change_box{
    margin-top: 20%;
    text-align: center;
}
.unactive{
    display: none;
}
.useactive{
    display: block;
}
</style>
