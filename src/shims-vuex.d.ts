import { Store } from 'vuex'

declare module '@vue/runtime-core' {
    // declare your own store states
    interface State {
        auth: {
            isAuthenticated: boolean
        },
        spinner: {
            isSpinning: boolean
        }
    }

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
