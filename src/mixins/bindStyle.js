export default {
    methods: {
        /**
         * @Desc 设置主题
         */
        convertThemeListAttrToStyleObject() {
            var themeList = this.propData.themeList
            if (!themeList) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : 'idm-theme-'
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i]
                let bulletBgColorObj = {
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let timeDateStyle = {
                    'border-left-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let dotObject = {
                    'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let dotAfterObject = {
                    'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .right-file`, bulletBgColorObj)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .subtask-span`, bulletBgColorObj)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .ant-timeline-item-tail`, timeDateStyle)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .subtaskdot`, dotObject)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .subtaskdot:after`, dotAfterObject)
            }
        },
        /**
         * @Desc 设置样式
         */
        handleStyle() {
            let styleObject = {},
                liObject = {},
                timeObject = {},
                timeMarginLeftObject = {},
                timeTimeRightObject = {},
                borderStyle = {},
                contentFontObject = {},
                fileStyleObject = {},
                listTitleNameObj = {}
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
                        case 'timeLiBottom':
                            liObject['padding'] = `0 0 ${element}`
                            break
                        case 'timeLiFont':
                            IDM.style.setFontStyle(timeObject, element, true)
                            break
                        case 'timeDateRight':
                            timeMarginLeftObject['margin'] = `0 0 0 ${element}`
                            break
                        case 'timeDateLeft':
                            timeTimeRightObject['margin-right'] = element
                            break
                        case 'timeChooseLine':
                            borderStyle['border-left-style'] = element
                            break
                        case 'timeLineColor':
                            borderStyle['border-color'] = element && element.hex8
                            break
                        case 'timeContentFont':
                            IDM.style.setFontStyle(contentFontObject, element, true)
                            break
                        case 'fileContentFont':
                            IDM.style.setFontStyle(fileStyleObject, element, true)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog', styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item', liObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .right-time', timeObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item-content', timeMarginLeftObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item-content .right-time', timeTimeRightObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item-tail', borderStyle)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .right-content span', contentFontObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .right-content .right-file', fileStyleObject)
        }
    }
}
