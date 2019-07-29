<template>
        <!-- <router-view v-on:event="AllEvent"  name="contentLayout" ></router-view> -->
         <router-view v-on:event="AllEvent"  name="contentLayout" ></router-view>
</template>

<script>

export default {

    methods : {
        AllEvent : function(type)  {
           // this.$emit('eventBus',type);   
            console.log('List');
        } 
    }

}
</script>