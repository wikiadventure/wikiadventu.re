import { Notify, copyToClipboard } from "quasar";
import { i18n } from "src/boot/i18n";
import { useI18n } from "vue-i18n";


export function CopyToClipboard(content:string) {
    copyToClipboard(content)
        .then(() => {
        Notify.create({
            type: 'annonce',
            timeout: 1000,
            position: 'bottom-right',
            message: i18n.global.t('copySuccess') as string
        });
        })
        .catch(() => {
        Notify.create({
            type: 'error',
            timeout: 1000,
            position: 'bottom-right',
            message: i18n.global.t('copyFail') as string
        });
        })
}