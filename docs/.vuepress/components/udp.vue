<template>
</template>
<script>
export default {
    name: 'udp',
    data() {
        return {

        }
    },
    created() {
        const params = this.queryParams();
    },
    methods: {
        queryParams() {
            let query = window.location.search.split('?')[1];
            let urlParams = {};
            if (query) {
                let match,
                    pl     = /\+/g,  // Regex for replacing addition symbol with a space
                    search = /([^&=]+)=?([^&]*)/g,
                    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
                while (match = search.exec(query))
                    urlParams[decode(match[1])] = decode(match[2]);
            }   
            return urlParams;
        }
    }
}
</script>