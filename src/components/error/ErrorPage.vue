<template>
     <div class="err-page-box">
        <div class="error_page_title_box">
                <p><span>Temporary network failure.<br/>Please quit and<br/>re-launch the wallet app.</span></p>
        </div>
        <div class="main_btn_box">
            <div class="err_btn_box" @click="appExit()">
                <span type="submit" value="Login">EXIT</span>
            </div>      
        </div>
    </div>    
</template>

<script>
/*const resourceHost = 'http://localhost:3000';
var abc = 'abc';
import axios from 'axios'
var axiosCheck =false;*/
import mapGetters from '../../store'
import { eventBus } from '../../main.js';


export default {
    data() {
        return {
           
        }
    },
    methods: {
        appExit() {
            //eventBus.$emit('event','loading');
            // 앱종료 예정
            exitApp();
        },
    },
    created() {
        const thisurl = document.location.href;
        this.$store.dispatch('ERRORLOG',{thisurl});
        eventBus.$emit('backStatus',false);   
        
    } 
}
</script>