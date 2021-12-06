import {
    create, // create naive ui
// components
    NCard,
    NButton, NCol, NRow, NForm, NFormItem, NInput, NMessageProvider, NA, NSpace, NSpin
} from 'naive-ui'

const naive = create({
    components: [
        NButton, NCard, NRow, NCol, NForm, NFormItem, NInput, NMessageProvider,
        NA, NSpace, NSpin
    ]
})

export default naive
