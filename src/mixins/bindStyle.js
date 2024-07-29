export default function (config) {
    return {
        methods: {
            /**
             * @Desc 设置主题
             */
            convertThemeListAttrToStyleObject() {
                var themeList = this.propData.themeList
                if (!themeList) {
                    return
                }
                const themeNamePrefix =
                    IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : 'idm-theme-'
                for (var i = 0; i < themeList.length; i++) {
                    var item = themeList[i]
                    let bulletBgColorObj = {
                        color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                    }
                    IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} ${config.wrap}`, bulletBgColorObj)
                }
            },
            /**
             * @Desc 设置样式
             */
            handleStyle() {
                let styleObject = {}
                for (const key in this.propData) {
                    if (this.propData.hasOwnProperty.call(this.propData, key)) {
                        const element = this.propData[key]
                        if (!element && element !== false && element != 0) {
                            continue
                        }
                        switch (key) {
                            case 'width':
                                styleObject['width'] = element
                                break
                            case 'height':
                                styleObject['height'] = element
                                break
                            case 'ulbox':
                                IDM.style.setBoxStyle(styleObject, element)
                                break
                            case 'bgColor':
                                styleObject['background-color'] = element && element.hex8
                                break
                            case 'boxShadow':
                                styleObject['box-shadow'] = element
                                break
                            case 'boxborder':
                                IDM.style.setBorderStyle(styleObject, element)
                                break
                        }
                    }
                }
                window.IDM.setStyleToPageHead(`${this.moduleObject.id} ${config.wrap}`, styleObject)
            }
        }
    }
}
