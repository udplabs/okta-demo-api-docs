<style scoped>
.button {
	background-color: #e36816;
	border-radius: 28px;
	border: 1px solid #ff8400;
	display: inline-block;
	cursor: pointer;
	color: #ffffff;
	font-family: Arial;
	font-size: 17px;
	padding: 16px 31px;
	text-decoration: none;
	text-shadow: 0px 1px 0px #f0700e;
}
.button:hover {
	background-color:#f07a13;
}
.button:active {
	position:relative;
	top:1px;
}

.loader {
    display: inline-block;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #71767c;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.inline {
    display: inline-block;
	font-family: Arial;
	font-size: 12px;
    color: #71767c
}

</style>
<template>
    <div>
        Click to download the Postman Collection: &nbsp;&nbsp;
        <div class="inline" v-if="loading">
            <button class="loader" disabled></button>
            &nbsp;Downloading...
        </div>
        <button 
            v-else
            class="button" 
            @click="download"
        >Download Collection</button>
    </div>
</template>

<script>
import FileSaver from 'file-saver';
import axios from 'axios';
export default {
    name: 'postman',
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async download() {
            this.loading = true;
            const res = await axios.post(
                'https://services.unidemo.info/test/api/admin/System/download-postman-collection'
            );
            if (res.status === 200) {
                const file = new File([JSON.stringify(res.data, null, '\t')], "okta-demo-api.postman_collection.json", {type: "application/json"});
                FileSaver.saveAs(file);
            }
            this.loading = false;
        }
    }
}
</script>