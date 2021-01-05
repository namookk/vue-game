import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        login_username : ''
    },
    mutations: {
        login (state,username) {
            state.login_username  = username;
        }
    },
    getters : {
        USERNAME : state =>{
            return state.login_username;
        }
    },
    plugins:[
        createPersistedState()
    ]
});