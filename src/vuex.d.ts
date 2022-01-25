import { Store } from 'vuex'

declare module '@vue/runtime-core' {
    // declare your own store states
    interface State {
        spinner: {
            isSpinning: number
        };
        auth : {
            isAuthenticated: boolean
        };
    }

    interface ComponentCustomProperties {
        $store: Store<State>
    }
}