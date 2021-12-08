export const  GET_SPINNER_STATUS = 'GET_SPINNER_STATUS'
export const  SET_SPINNER_STATUS = 'SET_SPINNER_STATUS'

export default {
    namespaced: true,
    state: {
        isSpinning: false
    },
    getters: {
        [GET_SPINNER_STATUS](state: { isSpinning: boolean}) {
            return state.isSpinning
        }
    },
    mutations: {
        [SET_SPINNER_STATUS](state: { isSpinning: boolean }, payload: boolean) {
            state.isSpinning = payload
        }
    }
}
