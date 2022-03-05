import {h, resolveComponent} from "vue";
import {NIcon} from "naive-ui";
// @ts-ignore
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";

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
export function currencyValue(value: number): any {
    if(value >= 0 ) {
        let values = value.toString().replace(/[\D\s._-]+/g, '');
        const numberValue = values ? parseInt(values, 10) : 0;
        values = numberValue === 0 ? '' : numberValue.toLocaleString('en-US');
        return `UGX ${values.length !== 0 ? values : "0.000"}`
    } else return `UGX ${value}`
}


// export function printPDF(id: string, name = "") {
//     const pdf = new jsPDF();
//     const element = document.getElementById(id);
//     if(element) {
//         const width= Number(element.style.width);
//         const height = Number(element.style.height);
//         html2canvas(element).then(canvas => {
//             const image = canvas.toDataURL('image/png');
//             pdf.addImage(image, 'JPEG', 15, 40, width, height);
//             pdf.save(name + " " + moment(new Date()).format('LL') + '.pdf');
//         });
//     }
// }

export async function printPDF(Component: HTMLElement, name = "") {
    await html2canvas(Component).then((canvas) => {
        const componentWidth = Component.offsetWidth
        const componentHeight = Component.offsetHeight

        const orientation = componentWidth >= componentHeight ? 'l' : 'p'

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation,
            unit: 'px'
        })

        pdf.internal.pageSize.width = componentWidth
        pdf.internal.pageSize.height = componentHeight

        pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
        pdf.save(name + " " + moment(new Date()).format('LL') + '.pdf')
    })
}