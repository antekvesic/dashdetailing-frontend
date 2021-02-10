import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios)

const httpClient = Vue.axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    headers: {
        // defaultni headeri ove instance (httpClient) organizirani "key": "value"
        "Content-Type": "application/json"
    }
});

export default httpClient;