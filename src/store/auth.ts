export const  GET_IS_AUTHENTICATED = 'GET_IS_AUTHENTICATED'
export const  SET_AUTH = 'SET_AUTH'
export default {
    namespaced: true,
    state: {
        isAuthenticated: false
    },
    getters: {
        [GET_IS_AUTHENTICATED](state: { isAuthenticated: boolean}) {
            return state.isAuthenticated && !!localStorage.getItem('access_token')
        }
    },
    mutations: {
        [SET_AUTH](
            state: { isAuthenticated: boolean },
            payload: { login: boolean, tokens?: {access: string, refresh: string} }
        ) {
            if(payload.login) {
                localStorage.setItem('access_token', payload.tokens?.access || '')
                localStorage.setItem('refresh_token', payload.tokens?.refresh || '')
            } else {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
            }
            state.isAuthenticated = payload.login
        }
    }
}
