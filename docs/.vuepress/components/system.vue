<style scoped>
.button {
	background-color: #e22866;
	border-radius: 18px;
    outline: none;
	border: 2px solid #e22866;
	display: inline-block;
	cursor: pointer;
	color: #ffffff;
	font-family: Arial;
	font-size: 17px;
    padding: 12px 66px;
	text-decoration: none;
}
.button2 {
	background-color: #2f3f4a;
}
.button3 {
	background-color: white;
    border: 2px solid #2f3f4a;
    color: #2f3f4a;
}
.button:hover {
	background-color:#ed2668;
}
.button3:hover {
	background-color: white;
    color: #ed2668;
}
.button:active {
	position:relative;
	top:1px;
    border-radius: 18px;
}
.loader {
    display: inline-block;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #71767c;
    border-radius: 50%;
    width: 35px;
    height: 35px;
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
    color: #71767c;
}
.loader-align-text {
    display: inline-block;
    vertical-align: sub;
}
.table {
    font-size: 12px;
}
.left-column {
    width: 40px;
    font-weight: 600;
}
.right-column {
    min-width: 146px;
}
.info {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
}
.highlighted {
    color: #e22866;
}
.message {
    color: green;
}
.error {
    color: red;
}
</style>

<template>
    <div v-if="authenticated">
        <p class="info highlighted">You are logged-in to <strong>{{ org }}</strong> as <strong>{{ jwtDecoded.payload.sub }}</strong></p>
        <h4>Click to execute System Reset:</h4>
        <div class="inline"
            v-if="running"
            >
            <div class="loader-align-text"><button class="loader" disabled></button></div>
            &nbsp;Requesting System Reset...
        </div>
        <div v-else>
            <button
                class="button" 
                @click="reset"
            >System Reset</button>
            <h3>Previous Jobs:</h3>
            <div v-if="!refreshingJobs">
                <table class="table" v-if="jobs">
                    <a href="#" @click="refreshJobsList">Refresh</a>
                    <tr>
                        <th>Event Date Time</th>
                        <th>Detail</th>
                    </tr>
                    <tr v-for="job in jobs.data">
                        <td>{{job.eventDateTime}}</td>
                        <td>{{job.supporting}}</td>
                    </tr>
                    <a v-if="jobs.paging.currentPage < jobs.paging.totalPages" 
                        href="#" 
                        @click="moreJobs"
                    >more (page {{jobs.paging.currentPage}} out of {{jobs.paging.totalPages}})</a>
                </table>
                <p v-else>None</p>
            </div>
        </div>
        <div v-if="error">
            <p class="table error">{{ error }}</p>
        </div>
        <div v-if="id">
            <table class="table">
                <p class="message">{{ message }}</p>
                <tr class="right-column">
                    <td class="left-column">job id:</td>
                    <td class="right-column">{{ id }}</td>
                </tr>
            </table>

            <br/>
            <h4>Check Status</h4>
            <p class="info">System resets run in the background and take a few seconds to complete.<br/>
            Click <strong>Check Status</strong> to see if the job has completed.
            </p>
            <button class="button button2" @click="checkStatus">
            Check Status
            </button>
            <table class="table">
                <tr>
                    <td class="left-column">status:</td>
                    <td class="right-column">{{ status }}</td>
                </tr>
            </table>
            <div class="check">
                <li>Status displays one of the following states: <strong>Scheduled, Processing, Succeeded</strong></li>
                <li>Once you've received a status state of <strong>Succeeded</strong> your UDP Demo API environment is ready to for use.
                Hop over to the <a href="./setup-postman">Postman</a> section to download the Postman collections.
                </li>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if="ready">
            <p class="info">Before using the API, you must login to the Org</p>
            <h4>Click Login to authorize the System Reset API:</h4>
            <button
                class="button button3" 
                @click="login"
            >Login</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import AuthJs from '@okta/okta-auth-js';
export default {
    name: 'system',
    data() {
        return {
            status: undefined,
            message: undefined,
            error: undefined,
            id: undefined,
            udpConfig: undefined,
            authenticated: false,
            authClient: undefined,
            subdomain: undefined,
            ready: false,
            running: false,
            jwtDecoded: undefined,
            accessToken: undefined,
            jobs: undefined,
            refreshingJobs: false
        }
    },
    computed: {
        org() {
            return this.jwtDecoded.payload.iss.split('/oauth2')[0];
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async login() {
            try {
                const options = {
                    pkce: false,
                    scopes: ['openid', 'email', 'system', 'ecommerce', 'hospitality']
                }
                const res = await this.authClient.token.getWithPopup(options);
                var tokens = res.tokens;
                this.authClient.tokenManager.add('idToken', tokens.idToken);
                this.authClient.tokenManager.add('accessToken', tokens.accessToken);
                this.populateJwt(tokens.accessToken);
                this.jobs = await this.listJobs();
            }
            catch(err) {
                console.log('ERROR:');
                console.log(err);
            }
        },
        async reset() {
            this.error = undefined;
            this.message = undefined;
            try {
                const tokens = await this.authClient.tokenManager.get('accessToken');
                this.running = true;
                const headers = {
                    headers: {
                        Authorization: 'Bearer ' + tokens.accessToken
                    }
                }
                const reset = await axios.post(
                    process.env.VUE_APP_API_URL + '/' + this.subdomain + '/api/admin/System/reset',
                    {},
                    headers
                );
                const data = reset.data;
                this.id = this.parseJobId(data.links[0].uri);
                this.message = data.message;
                this.running = false;
                await this.refreshJobsList();
            }
            catch(err) {
                console.log('ERROR:');
                console.log(err.response);
                if (err.response.status >= 400 && err.response.status < 500) {
                    this.error = err.response.data.Message;
                    this.id = undefined;
                    this.running = false;
                }
            }
        },
        parseJobId(uri) {
            const parts = uri.split('/');
            return parts[parts.length - 1];
        },
        async init() {
            const subdomain = window.location.host.split('.')[0];
            this.subdomain = subdomain.startsWith('localhost') ? process.env.VUE_APP_TEST_SUBDOMAIN : subdomain;

            const pre = await axios.get(
                process.env.VUE_APP_UDP_API + '/api/configs/' + this.subdomain + '/services-docs'
            );
            this.udpConfig = pre.data;

            const authConfig = {
                issuer: this.udpConfig.okta_org_name + '/oauth2/' + this.udpConfig.settings.auth_server_id,
                clientId: this.udpConfig.settings.spa_client_id,
                responseType: ['id_token','token'],
                pkce: false
            }
            try {
                this.authClient = new AuthJs(authConfig);
                const token = await this.authClient.tokenManager.get('accessToken');
                this.populateJwt(token);
                this.jobs = await this.listJobs();
            } catch (e) {
                console.log(e);
            }
            this.ready = true;
        },
        populateJwt(token) {
            try {
                if (token) {
                    this.authenticated = true;
                    this.accessToken = token.value;
                    this.jwtDecoded = this.authClient.token.decode(token.value); 
                }
            } catch(e) {
                console.log(e);
            }
        },
        async listJobs(skip) {
            let data = undefined;
            try {
                const tokens = await this.authClient.tokenManager.get('accessToken');
                const headers = {
                    headers: {
                        Authorization: 'Bearer ' + tokens.accessToken
                    }
                };
                const skipParam = skip ? skip : 0;
                const res = await axios.get(
                    process.env.VUE_APP_API_URL + '/' + this.subdomain + '/api/admin/Event?Skip=' + skipParam + '&Limit=10',
                    headers
                );
                data = res.data;
            } catch {
                data = undefined;
            }
            return data;
        },
        async refreshJobsList() {
            this.refreshingJobs = true;
            this.jobs = await this.listJobs();
            this.refreshingJobs = false;
        },
        async moreJobs() {
            const skip = this.jobs.paging.currentPage * this.jobs.paging.currentPageSize;
            const data = await this.listJobs(skip);
            this.jobs.data = this.jobs.data.concat(data.data);
            this.jobs.paging = data.paging;
        },
        async checkStatus() {
            this.status = undefined;
            try {
                const tokens = await this.authClient.tokenManager.get('accessToken');
                const headers = {
                    headers: {
                        Authorization: 'Bearer ' + tokens.accessToken
                    }
                };
                const res = await axios.get(
                    process.env.VUE_APP_API_URL + '/' + this.subdomain + '/api/admin/System/jobstatus/' + this.id,
                    headers
                );
                this.status = res.data.message;
            } catch(e) {
                this.status = 'Unexpected error';
            }
        }
    }
}
</script>