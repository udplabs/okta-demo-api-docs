<style scoped>
</style>
<template>
    <div>
        <table>
            <tr>
                <th>Attribute</th>
                <th>Value</th>
            </tr>
            <tr v-for="row in rows">
                <td style="font-weight: bold; font-size: 14px;">{{row.name}}</td>
                <td :style='row.style ? row.style : "font-size: 14px;"'>{{row.value}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            subdomain: undefined,
            udpConfig: undefined,
            rows: [
                {
                    name: 'Token Name',
                    value: 'OktaDemoAPI'
                },
                {
                    name: 'Grant Type',
                    value: 'Authorization Code'
                },
                {
                    name: 'Callback URL',
                    value: 'https://localhost:5001/signin-oidc'
                },
                {
                    name: 'Authorize using browser',
                    value: 'leave unchecked',
                    style: 'font-style: italic'
                },
                {
                    name: 'Auth URL',
                    value: '',
                    style: 'font-size: 12px'
                },
                {
                    name: 'Access Token URL',
                    value: '',
                    style: 'font-size: 12px'
                },
                {
                    name: 'Client ID',
                    value: ''
                },
                {
                    name: 'Client Secret',
                    value: ''
                },
                {
                    name: 'Scope',
                    value: 'openid system ecommerce hospitality'
                },
                {
                    name: 'State',
                    value: 'somerandomstring'
                },
                {
                    name: 'Client Authentication',
                    value: 'Send client credentials in body',
                    style: 'font-style: italic'
                }
            ]
        }
    },
    async mounted() {
        await this.init();
        this.rows.forEach(row=>{
            if (row.name == 'Auth URL')
                row.value = this.udpConfig.okta_org_name + '/oauth2/' + this.udpConfig.settings.auth_server_id + '/v1/authorize';
            if (row.name == 'Access Token URL')
                row.value = this.udpConfig.okta_org_name + '/oauth2/' + this.udpConfig.settings.auth_server_id + '/v1/token';
            if (row.name == 'Client ID')
                row.value = this.udpConfig.settings.demo_client_id;
            if (row.name == 'Client Secret')
                row.value = this.udpConfig.settings.demo_client_secret;
        });
    },
    methods: {
        async init() {
            const subdomain = window.location.host.split('.')[0];
            this.subdomain = subdomain.startsWith('localhost') ? process.env.VUE_APP_TEST_SUBDOMAIN : subdomain;

            const pre = await axios.get(
                process.env.VUE_APP_UDP_API + '/api/configs/' + this.subdomain + '/services-docs'
            );
            this.udpConfig = pre.data;
        },        
    }
}
</script>