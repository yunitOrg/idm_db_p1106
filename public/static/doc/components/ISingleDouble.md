# 双屏控件
此组件是双屏控件，这里是组件简介
## 组件类ID（ISingleDouble）
idm.component.dbAction.isingledouble
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
dbAction@1.0.0
## 组件属性
### 唯一标识【ctrlId】

- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 风格【showStyle】
展示风格：单屏(单屏就是左屏)、双屏(双屏又分为：全屏、左右屏)
- 标识：`showStyle`
- 默认值：`doudleStyle`
- 选项：
	 - 单屏【singleStyle】
	 - 双屏【doudleStyle】

#### 单屏宽【singleWidth】
单屏宽度
- 标识：`singleWidth`
- 默认值：`90%`
- 显示：`@[showStyle == 'singleStyle']`
#### 全屏左【screenLeftWidth】
全屏模式下：左侧宽
- 标识：`screenLeftWidth`
- 默认值：`71%`
- 显示：`@[showStyle == 'doudleStyle']`
#### 全屏右【screenRightWidth】
全屏模式下：右侧宽
- 标识：`screenRightWidth`
- 默认值：`28%`
- 显示：`@[showStyle == 'doudleStyle']`
#### 左右屏左【doubleLeftWidth】
左右屏模式下：左侧宽
- 标识：`doubleLeftWidth`
- 默认值：`49.5%`
- 显示：`@[showStyle == 'doudleStyle']`
#### 左右屏右【doubleRightWidth】
左右屏屏模式下：右侧宽
- 标识：`doubleRightWidth`
- 默认值：`49.5%`
- 显示：`@[showStyle == 'doudleStyle']`
#### 左侧Tab【showLeftTab】
左侧Tab是否展示
- 标识：`showLeftTab`
- 默认值：`true`
#### 底部【showBottom】
底部是否展示
- 标识：`showBottom`
- 默认值：`true`
#### 底部高【footerHeight】
底部高: 单位为px
- 标识：`footerHeight`
- 默认值：`70`
- 显示：`@[showBottom]`
#### 全屏图标【screenBigIcon】

- 标识：`screenBigIcon`
- 默认值：空
#### 缩小图标【screenSmallIcon】

- 标识：`screenSmallIcon`
- 默认值：空
#### 全屏图标right【screenIconRight】
全屏图标距离右侧间距，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`screenIconRight`
- 默认值：`10px`
### 外层样式
#### 宽【width】
填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`width`
- 默认值：`100%`
#### 高【heightRadio】
填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等
- 标识：`heightRadio`
- 默认值：`screen`
- 选项：
	 - 固定值【fixed】
	 - 适应容器【adaptive】
	 - 屏幕高【screen】

#### 高【height】
填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`height`
- 默认值：`100%`
- 显示：`@[heightRadio == 'fixed']`
#### 内外边距【ulbox】

- 标识：`ulbox`
- 默认值：
```json
{
    "marginTopVal": "",
    "marginRightVal": "",
    "marginBottomVal": "",
    "marginLeftVal": "",
    "paddingTopVal": "1%",
    "paddingRightVal": "2%",
    "paddingBottomVal": "1%",
    "paddingLeftVal": "2%"
}
```
#### 渐变色【bglinear】
背景渐变色
- 标识：`bglinear`
- 默认值：空
#### 背景色【bgColor】

- 标识：`bgColor`
- 默认值：
```json
{
    "hex8": "#FFFFFFFF"
}
```
#### 容器阴影【boxShadow】

- 标识：`boxShadow`
- 默认值：空
#### 边框【boxborder】

- 标识：`boxborder`
- 默认值：空
### 全屏左样式
#### 内外边距【screenLeftUlbox】

- 标识：`screenLeftUlbox`
- 默认值：
```json
{
    "marginTopVal": "",
    "marginRightVal": "",
    "marginBottomVal": "",
    "marginLeftVal": "",
    "paddingTopVal": "20px",
    "paddingRightVal": "40px",
    "paddingBottomVal": "",
    "paddingLeftVal": "40px"
}
```
### 全屏右样式
#### 内外边距【screenRightUlbox】

- 标识：`screenRightUlbox`
- 默认值：
```json
{
    "marginTopVal": "",
    "marginRightVal": "",
    "marginBottomVal": "",
    "marginLeftVal": "",
    "paddingTopVal": "10px",
    "paddingRightVal": "15px",
    "paddingBottomVal": "20px",
    "paddingLeftVal": "15px"
}
```
### 悬浮容器左侧
#### top【leftBoxTop】
上定位
- 标识：`leftBoxTop`
- 默认值：空
#### right【leftBoxRight】
右定位
- 标识：`leftBoxRight`
- 默认值：`35px`
#### bottom【leftBoxBottom】
下定位
- 标识：`leftBoxBottom`
- 默认值：`76px`
#### left【leftBoxLeft】
左定位
- 标识：`leftBoxLeft`
- 默认值：空
#### 层级【containerLeftIndex】
层级: 99
- 标识：`containerLeftIndex`
- 默认值：`99`
#### 背景颜色【suspenLeftColor】
悬浮容器背景颜色
- 标识：`suspenLeftColor`
- 默认值：空
#### 默认展开【containerLeftDefaultShow】
默认展开： 图标组会默认展示
- 标识：`containerLeftDefaultShow`
- 默认值：`false`
#### 悬浮容器【containerLeftList】

- 标识：`containerLeftList`
- 默认值：
```json
[
    {
        "keyLeft": "single-up",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "回到顶部",
        "containerGenLeft": false,
        "containerImageLeft": "",
        "eventBindLeft": "alearyEvent",
        "eventAlreadyNameLeft": "SingleBackTop",
        "eventCustomLeft": []
    },
    {
        "keyLeft": "single-down",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "回到底部",
        "containerGenLeft": false,
        "containerImageLeft": "",
        "eventBindLeft": "alearyEvent",
        "eventAlreadyNameLeft": "SingleBackBttom"
    },
    {
        "keyLeft": "single-mu",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "目录",
        "containerGenLeft": false,
        "containerImageLeft": ""
    },
    {
        "keyLeft": "single-config",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "后台配置",
        "containerGenLeft": false,
        "containerImageLeft": ""
    },
    {
        "keyLeft": "single-font",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "字体",
        "containerGenLeft": false,
        "containerImageLeft": "",
        "sendFontSize": "changeFontSize",
        "handleFontParamLeft": [],
        "fontClickIntefaceLeft": []
    },
    {
        "keyLeft": "single-fenping",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "切换分屏显示",
        "containerGenLeft": false,
        "containerImageLeft": "",
        "eventBindLeft": "alearyEvent",
        "eventAlreadyNameLeft": "SingleChangePage",
        "eventCustomLeft": []
    },
    {
        "keyLeft": "single-more",
        "isShowLeft": true,
        "handlePowerLeft": [],
        "tipsLeft": "更多",
        "containerGenLeft": true,
        "containerImageLeft": "",
        "eventBindLeft": "alearyEvent",
        "eventAlreadyNameLeft": "SingleShowMenu"
    }
]
```
### 悬浮容器右侧
#### top【rightBoxTop】
上定位
- 标识：`rightBoxTop`
- 默认值：空
#### right【rightBoxRight】
右定位
- 标识：`rightBoxRight`
- 默认值：`35px`
#### bottom【rightBoxBottom】
下定位
- 标识：`rightBoxBottom`
- 默认值：`76px`
#### left【rightBoxLeft】
左定位
- 标识：`rightBoxLeft`
- 默认值：空
#### 层级【containerRightIndex】
层级: 99
- 标识：`containerRightIndex`
- 默认值：`99`
#### 背景颜色【suspenRightColor】
悬浮容器背景颜色
- 标识：`suspenRightColor`
- 默认值：空
#### 默认展开【containerRightDefaultShow】
默认展开： 图标组会默认展示
- 标识：`containerRightDefaultShow`
- 默认值：`false`
#### 悬浮容器【containerRightList】

- 标识：`containerRightList`
- 默认值：
```json
[
    {
        "keyRight": "single-left",
        "isShowRight": true,
        "handlePowerRight": [],
        "tipsRight": "上一篇",
        "containerGenRight": false,
        "containerImageRight": "",
        "eventBindRight": "alearyEvent",
        "eventAlreadyNameRight": "SinglePrev",
        "eventCustomRight": []
    },
    {
        "keyRight": "single-right",
        "isShowRight": true,
        "handlePowerRight": [],
        "tipsRight": "下一篇",
        "containerGenRight": false,
        "containerImageRight": "",
        "eventBindRight": "alearyEvent",
        "eventAlreadyNameRight": "SingleNext",
        "eventCustomRight": []
    },
    {
        "keyRight": "single-loop",
        "isShowRight": true,
        "handlePowerRight": [],
        "tipsRight": "左右切换",
        "containerGenRight": false,
        "containerImageRight": "",
        "eventBindRight": "alearyEvent",
        "eventAlreadyNameRight": "SingleLeftRightChange",
        "eventCustomRight": []
    },
    {
        "keyRight": "single-download",
        "isShowRight": true,
        "handlePowerRight": [],
        "tipsRight": "下载",
        "containerGenRight": false,
        "containerImageRight": "",
        "eventBindRight": "alearyEvent",
        "eventAlreadyNameRight": "SingleDownload",
        "eventCustomRight": []
    },
    {
        "keyRight": "single-fp",
        "isShowRight": true,
        "handlePowerRight": [],
        "tipsRight": "全屏",
        "containerGenRight": false,
        "containerImageRight": "",
        "eventBindRight": "alearyEvent",
        "eventAlreadyNameRight": "SingleFullPage",
        "eventCustomRight": []
    },
    {
        "keyRight": "single-more",
        "isShowRight": true,
        "handlePowerRight": [],
        "tipsRight": "更多",
        "containerGenRight": true,
        "containerImageRight": "",
        "eventBindRight": "alearyEvent",
        "eventAlreadyNameRight": "SingleShowMenu"
    }
]
```
### 左屏-tab样式
#### 表单信息【firstTab】
tab第一个默认文字
- 标识：`firstTab`
- 默认值：`表单信息`
#### 文字样式【tabFont】
文字样式
- 标识：`tabFont`
- 默认值：
```json
{
    "fontColors": {
        "hex": "#333333",
        "hex8": "#333333"
    },
    "fontFamily": "",
    "fontLetterSpacing": "",
    "fontLetterSpacingUnit": ""
}
```
#### 选中样式【tabChooseFont】
文字选中的样式
- 标识：`tabChooseFont`
- 默认值：
```json
{
    "fontColors": {},
    "fontFamily": "",
    "fontLetterSpacing": "",
    "fontLetterSpacingUnit": "",
    "fontWeight": "600 Semi Bold"
}
```
#### 数量离左边【numberLeftBox】
数字距离左距离 可使用px、%、vw等单位，比如100px、100%、100vw等等
- 标识：`numberLeftBox`
- 默认值：`5px`
### 正在预览提示文字
#### 是否展示【tipsFontShow】
提示文字是否展示
- 标识：`tipsFontShow`
- 默认值：`true`
#### top【contentTipsTop】
距离顶部距离 可使用px、%、vw等单位，比如100px、100%、100vw等等
- 标识：`contentTipsTop`
- 默认值：`50px`
- 显示：`@[tipsFontShow]`
#### right【contentTipsRight】
自定距离右边距离 可使用px、%、vw等单位，比如100px、100%、100vw等等义内容
- 标识：`contentTipsRight`
- 默认值：`80px`
- 显示：`@[tipsFontShow]`
#### 正在预览内容【previewTipsHtml】
函数返回预览内容例如：<div style='font-size:16px;font-weight:bold;'>正在预览，如需修改请进入<a style='color:#0080FF;cursor:pointer;'>修改模式</a></div>
- 标识：`previewTipsHtml`
- 默认值：空
- 显示：`@[tipsFontShow]`
- 可设置函数数量：单个
### 水印
#### 水印【showWater】
水印是否开启
- 标识：`showWater`
- 默认值：`false`
#### 水印内容【waterContent】
水印内容：自定义、接口
- 标识：`waterContent`
- 默认值：`waterCustom`
- 显示：`@[showWater]`
- 选项：
	 - 自定义【waterCustom】
	 - 接口【waterInterface】

#### 自定义内容【dragBottom】
自定义内容
- 标识：`dragBottom`
- 默认值：`2024-01-22 15:42:05`
- 显示：`@[waterContent == 'waterCustom']`
#### 数据源【waterDataSource】
水印所需的数据源返回格式比如：市发展改革委,李武元,2024-01-22 15:42:05
- 标识：`waterDataSource`
- 默认值：空
- 显示：`@[waterContent == 'waterInterface']`
### 主题设置【themeList】
点击？查看主题设置用法指南
- 标识：`themeList`
- 默认值：
```json
[
    {
        "key": "blue",
        "mainColor": {
            "hex": "#0073CA",
            "hex8": "#0073CAFF"
        }
    },
    {
        "key": "red",
        "mainColor": {
            "hex": "#E21A1A",
            "hex8": "#E21A1AFF"
        }
    },
    {
        "key": "green",
        "mainColor": {
            "hex": "#0EAF64",
            "hex8": "#0EAF64FF"
        }
    }
]
```
### 高级
#### 记住分屏接口【rememberServe】
数据源返回格式比如：系统管理员
- 标识：`rememberServe`
- 默认值：`/ctrl/configsetup/save`