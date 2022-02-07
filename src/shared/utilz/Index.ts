import {h, resolveComponent} from "vue";
import {NIcon} from "naive-ui";

export function renderIcon (icon: any) {
    return () => h(NIcon, null, {default: () => [h(icon)]})
}
export function renderTableTitles (name: string) {
    return () => h(
        'span',
        {class: 'text-current font-mono text-md font-semibold'},
        name
    )
}

export function renderRouterLink (to: string, labelName: string, params = null ) {
    return () => h(
        resolveComponent('router-link'),
        { to: { name: to, params: params } },
        () => labelName
    )
}

