import {createI18n} from 'vue-i18n'
import en from './en'
import zh from './zh'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
const messages = {
    zh_CN: {
        ...zh,
        ...zhLocale
    },
    en_US: {
        ...en,
        ...enLocale
    }
}

const i18n = createI18n({
    locale: 'zh_CN', // set locale
    messages, // set locale messages
})

export default i18n

