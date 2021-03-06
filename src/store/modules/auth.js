import httpClient from '@/common/httpClient'
import Swal from 'sweetalert2'
import router from '../../router'

// initial state
const state = () => ({
    status: '',
    token: localStorage.getItem('token') || '',
    displayName: localStorage.getItem('displayName') || '',
    adminPermissions: false
})

// getters
const getters = {
    isLoggedIn: state => !!state.token,
    hasAdminPermissions: state => state.adminPermissions,
    authStatus: state => state.status,
    displayName: state => state.displayName
}

// actions
const actions = {
    logIn({commit}, user){
        return new Promise((resolve, reject) => {
            commit('auth_request')
            httpClient.post("/prijava", user)
            .then(response => {
                // console.log(response)
                // check response status
                if(response.status === 200) { // OK
                // assign response data
                    const token = response.data.access_token
                    const displayName = response.data.user.ime
                    const role = response.data.user.role
                    if(role === 'Admin' ||  role === 'Superadmin') {
                        // console.log('ADMIN here :)')
                        commit('auth_admin')
                    }
                    // save token to local storage
                    localStorage.setItem('token', token)
                    // save display name to local storage
                    localStorage.setItem('displayName',displayName)
                    // set header
                    httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + token
                    // call mutation
                    commit('auth_success', { token, displayName })
                    resolve(response)
                }
            })
            .catch(err => {
                commit('auth_error')
                localStorage.removeItem('token')
                reject(err)
            })
        })
    },
    register({commit}, user) {
        return new Promise((resolve, reject) => {
            commit('auth_request')
            httpClient.post("/registracija", user)
            .then(response => {
                // console.log(response.data)
                // check response status
                if(response.status === 201) { // resource created 
                    // assign response data
                    const token = response.data.access_token
                    const displayName = response.data.user.ime
                    // save token to local storage
                    localStorage.setItem('token', token)
                    // save display name to local storage
                    localStorage.setItem('displayName', displayName)
                    // set header
                    httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + token
                    // call mutation
                    commit('auth_success', { token, displayName })
                    commit('registration_success_alert')
                    resolve(response)
                }
            })
            .catch(err => {
                commit('auth_error', err)
                localStorage.removeItem('token')
                reject(err)
            })
        })
    },
    logOut({commit}) {
        return new Promise((resolve, reject) => {
            httpClient.post("/odjava")
            .then((response) => {
                // Success :)
                // console.log(response);

                commit('logout')
                localStorage.removeItem('token')
                localStorage.removeItem('displayName')
                delete httpClient.defaults.headers.common['Authorization']
                resolve(response)
                commit('logout_success_alert')
            })
            .catch((error) => {
                // Error :\
                if (error.response) {
                    /*
                     * The request was made and the server responded with a
                     * status code that falls out of the range of 2xx
                     */
                    console.log(error.response.data);
                    console.log(error.response.status);
                    // console.log(error.response.headers);
                } else if (error.request) {
                    /*
                     * The request was made but no response was received, `error.request`
                     * is an instance of XMLHttpRequest in the browser and an instance
                     * of http.ClientRequest in Node.js
                     */
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request and triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
                reject(error)
            });
        })
    }
}

// mutations
const mutations = {
    auth_request(state){
        state.status= 'loading'
    },
    auth_error(state){
        state.status = 'error'
    },
    auth_success(state, { token, displayName }){
        state.status = 'success'
        state.token = token
        state.displayName = displayName
    },
    auth_admin(state){
        state.adminPermissions= true
    },
    logout(state){
        state.status = ''
        state.token = ''
        state.displayName = ''
    },
    /* successful registration alert */
    registration_success_alert(){
        Swal.fire({
            text: 'Račun uspješno napravljen.',
            icon: 'success',
            confirmButtonText: 'Nastavak'
          })
          .then(() => router.go(-1))
    },
    /*********************************/
    /* successful registration alert */
    logout_success_alert(){
        Swal.fire({
            width: 400,
            position: 'top-end',
            icon: 'info',
            title: 'Uspješno ste odjavljeni.',
            showConfirmButton: false,
            timer: 1500
          })
    }

    /*********************************/
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}