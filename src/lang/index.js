
import { createI18n } from 'vue-i18n'
import en from './en.js'
import zh from './zh.js'


const lang = "en";

const messages = { en, zh };

const local = messages[lang];


const i18n = createI18n({
    locale: lang,
    messages: messages,
})

export default {
    i18n,
    local
}