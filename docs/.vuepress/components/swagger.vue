<template>
    <div>
        <iframe ref='swagger'
            title='swagger'
            frameborder="0"
            height="900px" width="100%"
        ></iframe>
    </div>    
</template>
<script>
export default {
    name: 'swagger',
    data() {
        return {
            url: process.env.VUE_APP_API_URL + '/swagger/index.html'
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            const iframe = this.$refs.swagger;
            iframe.src = this.url;
        });
    }
}
</script>