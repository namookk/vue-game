import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        login_user : '',
        // server_url : 'http://192.168.11.209:9999'
        server_url : 'http://54.180.210.229:9999' 
    },
    mutations: {
        login (state,user) {
            state.login_user  = user;
        },
        logout (state) {
            state.login_user = ''
        }
    },
    getters : {
        USER : state =>{
            return state.login_user;
        },
        SERVER_URL : state =>{
            return state.server_url;
        }
    },
    plugins:[
        createPersistedState()
    ]
});