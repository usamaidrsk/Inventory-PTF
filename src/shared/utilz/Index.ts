import {h, resolveComponent} from "vue";
import {NIcon} from "naive-ui";

export function renderIcon (icon: any) {
    return () => h(NIcon, null, {default: () => [h(icon)]})
}

export function renderRouterLink (to: string, labelName: string, params = null ) {
    return () => h(
        resolveComponent('router-link'),
        { to: { name: to, params: params } },
        () => labelName
    )
}