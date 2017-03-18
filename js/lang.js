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
    supportAttrName: [
        'langText',
        'langTitle'
    ],
	init: function(langType = false) {
        var THIS = this;
        langType && THIS.lang = langType;
        THIS.supportAttrName.map(function(attrName) {
            attr = attrName.replace('lang', '').toLocaleLowerCase();
            $("["+attrName+"]").each(function() {
                var langId = $(this).attr(attrName);
                if (attr == 'text') {
                    $(this).text(THIS.getLang(langId));
                } else {
                    $(this).attr(attr, THIS.getLang(langId));
                }
            });
            return;
        })

	},
    getLang: function (langMark) {
        try {
            return this.langInfo[langMark][this.lang];
        } catch (e) {
            return 'null';
        }
    },
    setElemLang: function (elem) {
        try {
            elem.text(this.getLang(elem.Attr('lang')))
        } catch (e) {
        }
    },
}