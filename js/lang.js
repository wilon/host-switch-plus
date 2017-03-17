/**
 * i18n supports
 *
 * @author wilon <github.com/wilon>
 */

var snailHostsLang = {
    lang: 'en',
	langInfo: {
        status_on: {
            en: 'On',
            zh_CN: '已开'
        },
        status_off: {
            en: 'Off',
            zh_CN: '已关'
        },
        manage_link: {
            en: 'manage',
            zh_CN: '管理'
        },
        all_tag: {
            en: 'AllTags: ',
            zh_CN: '标签：'
        },
        all_tag_title: {
            en: 'Double click to enable all.',
            zh_CN: '双击全部开启/关闭。'
        },
    },
	init: function(langType) {
        var t = this;
        t.lang = langType;
        $("[lang]").each(function() {
            var lang = $(this).attr('lang');
            $(this).text(t.getLang(lang));
        });
        $("[langTitle]").each(function() {
            var langTitle = $(this).attr('langTitle');
            $(this).attr('title', t.getLang(langTitle));
        });
	},
    getLang: function (langMark) {
        try {
            return this.langInfo[langMark][this.lang];
        } catch (e) {
            return 'null';
        }
    },
}