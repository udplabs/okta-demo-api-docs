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
    padding: 3px 22px;
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
.label {
    display: inline-block;
    width: 340px;
}
</style>

<template>
    <div>
        <br/>
        <div v-for="button in buttons">
            <div class="label">
                Click to download the Postman {{button.label}}:
            </div>
            <div class="inline" v-if="button.loading">
                <button class="loader" disabled></button>
                &nbsp;Downloading...
            </div>
            <button 
                v-else
                class="button" 
                @click="download(button)"
            >Download {{button.label}}</button>
            <hr v-if="button.label=='Collection'"/>
        </div>
    </div>
</template>

<script>
import FileSaver from 'file-saver';
import axios from 'axios';
export default {
    name: 'postman',
    data() {
        return {
            subdomain: undefined,
            loading: false,
            buttons: [
                {
                    label: 'Collection',
                    api: '/api/admin/System/download-postman-collection',
                    filename: 'okta-demo-api.postman_collection.json',
                    loading: false
                },
                {
                    label: 'Environment',
                    api: '/api/admin/System/download-postman-environment',
                    filename: 'okta-demo-api.postman_environment.json',
                    loading: false
                }
            ]
        }
    },
    async mounted() {
        const subdomain = window.location.host.split('.')[0];
        this.subdomain = subdomain.startsWith('localhost') ? process.env.VUE_APP_TEST_SUBDOMAIN : subdomain;
    },
    methods: {
        async download(button) {
            button.loading = true;
            const res = await axios.post(
                process.env.VUE_APP_API_URL + '/' + this.subdomain + button.api
            );
            if (res.status === 200) {
                if (this.subdomain) {
                    const val = res.data.values.find(val => { return val.key == 'TenantId' });
                    if (val) val.value = this.subdomain;
                }
                const file = new File([JSON.stringify(res.data, null, '\t')], button.filename, {type: "application/json"});
                FileSaver.saveAs(file);
            }
            button.loading = false;
        }
    }
}
</script>