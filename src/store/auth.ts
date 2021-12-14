export const GET_IS_AUTHENTICATED = 'GET_IS_AUTHENTICATED'
export const SET_IS_AUTHORISED = 'SET_IS_AUTHORISED'
export const SET_LOGOUT = 'SET_LOGOUT'

export default {
    namespaced: true,
    state: {
        isAuthenticated: false
    },
    getters: {
        [GET_IS_AUTHENTICATED](state: { isAuthenticated: any }) {
            return state.isAuthenticated
        }
    },
    mutations: {
        [SET_IS_AUTHORISED](state: { isAuthenticated: boolean }, payload: {access: string, refresh: string}) {
            localStorage.setItem('access-token', payload.access)
            localStorage.setItem('refresh-token', payload.refresh)
            state.isAuthenticated = true
        },
        [SET_LOGOUT](state: { isAuthenticated: boolean }) {
            localStorage.removeItem('access-token')
            localStorage.removeItem('refresh-token')
            state.isAuthenticated = false
        }
    }
}
