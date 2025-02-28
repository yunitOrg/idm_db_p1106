/**
 * 打开新窗口
 * @param {string} url
 */
export async function openWindow(url) {
    const link = document.createElement('iframe')
    link.src = IDM.url.getWebPath(url)
    link.style.width = '0px'
    link.style.height = '0px'
    link.style.display = 'none'
    document.body.appendChild(link)
    // document.body.removeChild(link);
}
/**
 * 通用的url参数对象
 * 所有地址url参数转换
 */
export const commonParam = () => {
    const urlObject = window.IDM?.url?.queryObject() || {}
    return {
        pageId: window.IDM?.broadcast?.pageModule?.id || '',
        urlData: JSON.stringify(urlObject)
    }
}
export * as dataUtil from './dataUtil'

export const propToStyle = (props) => {
    return _.reduce(
        _.toPairs(props),
        (carry, [key, value]) => {
            switch (key) {
                case 'width':
                    carry['width'] = value
                    break
                case 'height':
                    carry['height'] = value
                    break
                case 'ulbox':
                    IDM.style.setBoxStyle(carry, value)
                    break
                case 'bgColor':
                    carry['background-color'] = value && value.hex8
                    break
                case 'boxShadow':
                    carry['box-shadow'] = value
                    break
                case 'boxborder':
                    window.IDM.style.setBorderStyle(carry, value)
                    break
                case 'font':
                    carry['font-family'] = value.fontFamily
                    if (value.fontColors.hex8) {
                        carry['color'] = value.fontColors.hex8
                    }
                    carry['font-weight'] = value.fontWeight && value.fontWeight.split(' ')[0]
                    carry['font-style'] = value.fontStyle
                    carry['font-size'] = value.fontSize + value.fontSizeUnit
                    carry['line-height'] = value.fontLineHeight + (value.fontLineHeightUnit == '-' ? '' : value.fontLineHeightUnit)
                    carry['text-align'] = value.fontTextAlign
                    carry['text-decoration'] = value.fontDecoration
                    break
                case 'styleFunc':
                    carry = _.assign(carry, ...window.IDM.invokeCustomFunctions(value))
                    break
                case 'styleList':
                    _.forEach(value, (value) => {
                        carry[value.property] = value.value
                    })
                    break
            }
            return carry
        },
        {}
    )
}

const PINYIN_INITIAL_CONSONANT_LETTERS = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
// 拼音声母对应的边界中文
const PINYIN_BOUNDARY_CHAR = '驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳'.split('')
export const getChinesePinyinAbbreviation = (str) => {
    // 空字符串直接返回
    if (!str) {
        return ''
    }
    if (str.length > 1) {
        return str.split('').map(getChinesePinyinAbbreviation).join('')
    }
    // 判断字符是否为中文,不是中文返回原字符
    if (/[^\u4e00-\u9fa5]/.test(str)) {
        return str
    }
    const index = PINYIN_BOUNDARY_CHAR.findIndex((char) => {
        return char.localeCompare(str, 'zh-CN-u-co-pinyin') >= 0
    })
    return PINYIN_INITIAL_CONSONANT_LETTERS[index]
}
