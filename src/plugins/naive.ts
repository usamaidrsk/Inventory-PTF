import {
    create,
    NCard,
    NButton,
    NCol,
    NRow,
    NForm,
    NFormItem,
    NInput,
    NMessageProvider,
    NA,
    NSpace,
    NSpin,
    NLayout,
    NLayoutContent,
    NLayoutFooter,
    NLayoutSider,
    NLayoutHeader,
    NIcon,
    NMenu,
    NSwitch,
    NConfigProvider,
    NDropdown,
    NAvatar,
    NText,
    NGridItem, NGrid, NDivider, NDataTable,
} from 'naive-ui'

const naive = create({
    components: [
        NConfigProvider,NButton, NCard, NRow, NCol, NForm, NFormItem, NInput, NMessageProvider,
        NA, NSpace, NSpin, NLayout, NLayoutContent, NLayoutFooter, NLayoutSider, NLayoutHeader,
        NIcon, NMenu, NSwitch, NDropdown, NAvatar, NText, NGrid, NGridItem, NDivider, NDataTable
    ]
})

export default naive
