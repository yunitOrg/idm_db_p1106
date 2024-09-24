export default {
  data() {
    return {
      propData: this.$root.propData.compositeAttr || {
        emptySize: 100,
        width: '100%',
        height: '100%',
        titleName: '任务明细',
        titleShow: "show",
        cuibanBtn: false,
        titleIconShow: 'show',
        showHideIcon: 'right',
        showLeftWidth: '25px',
        showHideCloumn: 'show',
        titleIconFontSize: 18,
        ulbox: {
          marginTopVal: "",
          marginRightVal: "",
          marginBottomVal: "",
          marginLeftVal: "",
          paddingTopVal: "10px",
          paddingRightVal: "20px",
          paddingBottomVal: "10px",
          paddingLeftVal: "20px"
        },
        titleBox: {
          marginTopVal: "",
          marginRightVal: "",
          marginBottomVal: "20px",
          marginLeftVal: "",
          paddingTopVal: "",
          paddingRightVal: "",
          paddingBottomVal: "3px",
          paddingLeftVal: ""
        },
        libox: {
          marginTopVal: "",
          marginRightVal: "",
          marginBottomVal: "20px",
          marginLeftVal: "",
          paddingTopVal: "10px",
          paddingRightVal: "10px",
          paddingBottomVal: "10px",
          paddingLeftVal: "10px"
        },
        bgColor: {
          hex: "#ffffff",
          hex8: "#ffffff"
        },
        titleStyle: {
          fontColors: {
            hex: "#333",
            hex8: "#333"
          },
        },
        listTitleStyle: {
          fontColors: {
            hex: "#333",
            hex8: "#333"
          },
        },
        titleBorder: {
          border: {
            top: {
                style: "solid",
                width: 0,
                widthUnit: "px",
                colors: {
                  hex8: "",
                }
            },
            right: {
                style: "solid",
                width: 0,
                widthUnit: "px",
                colors: {
                  hex8: "",
                }
            },
            bottom: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            left: {
                style: "solid",
                width: 0,
                widthUnit: "px",
                colors: {
                  hex8: "",
                }
            }
        },
          radius: {
              leftTop: {
                  radius: 0,
                  radiusUnit: "px"
              },
              rightTop: {
                  radius: 0,
                  radiusUnit: "px"
              },
              leftBottom: {
                  radius: 0,
                  radiusUnit: "px"
              },
              rightBottom: {
                  radius: 0,
                  radiusUnit: "px"
              }
          }
        },
        liBoxborder: {
          border: {
            top: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            right: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            bottom: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            left: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            }
        },
          radius: {
              leftTop: {
                  radius: 5,
                  radiusUnit: "px"
              },
              rightTop: {
                  radius: 5,
                  radiusUnit: "px"
              },
              leftBottom: {
                  radius: 5,
                  radiusUnit: "px"
              },
              rightBottom: {
                  radius: 5,
                  radiusUnit: "px"
              }
          }
        },
        boxborder: {
          border: {
            top: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            right: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            bottom: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            },
            left: {
                style: "solid",
                width: 1,
                widthUnit: "px",
                colors: {
                  hex8: "#999",
                }
            }
        },
          radius: {
              leftTop: {
                  radius: 5,
                  radiusUnit: "px"
              },
              rightTop: {
                  radius: 5,
                  radiusUnit: "px"
              },
              leftBottom: {
                  radius: 5,
                  radiusUnit: "px"
              },
              rightBottom: {
                  radius: 5,
                  radiusUnit: "px"
              }
          }
        },
      }
    }
  },
  methods: {
    /**
     * @Desc 设置图标大小
     */
    setIconStyle(type, item) {
      let obj = {}
      switch(type) {
        case 'titleIcon':{
          obj = {
            'margin-right': item.titleRightDis,
            'font-size': item.titleSizeColor + 'px',
            'width': item.titleSizeColor + 'px',
            'height': item.titleSizeColor + 'px',
            'color': item.titleIconColor?.hex,
            'fill': item.titleIconColor?.hex
          }
        }
          break
        case 'taskiconDis':{
          obj = {
            'margin-right': item.listIconRight,
          }
        }
        break
        case 'liIcon':{
          obj = {
            'font-size': item.listIconSize + 'px',
            'width': item.listIconSize + 'px',
            'height': item.listIconSize + 'px',
            'color': item.listIconColor?.hex,
            'fill': item.listIconColor?.hex
          }
        }
          break
        case 'tipFont':{
          item.listIconStyle && IDM.style.setFontStyle(obj, item.listIconStyle);
        }
      }
      return obj
    },
    /**
     * @Desc 点击右侧图标事件
     */
    handleSvgClick(item) {
      if (item.handleTitleFunc && item.handleTitleFunc.length > 0) {
        let name = item.handleTitleFunc[0].name
        window[name] && window[name].call(this, {
          _this: this
        });
      }
    },
    /**
     * @Desc 点击列表展示折叠
     */
    handleShowList(item) {
      if (this.judgeUser) {
        return
      }
      if (this.propData.accordion == 'show') { // 只展示一个
        this.list.forEach(k => {
          if (k.key == item.key) {
            item.isShow = !item.isShow
          } else {
            k.isShow = false
          }
        })
      } else {
        item.isShow = !item.isShow
      }
    },
    /**
     * @Desc 展开折叠
     */
    onSwitchChange(checked) {
      console.log(checked, 123)
    },
    /**
     * @Desc 列表右侧按钮组
     */
    hadnleListIcon(icon, item) {
      if (icon.listIconFun && icon.listIconFun.length > 0) {
        let name = icon.listIconFun[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        });
      }
    },
    /**
     * @Desc 设置样式
     */
    handleStyle() {
      let styleObject = {},
        liObject = {},
        titleObject = {},
        titleNameObject = {},
        tipsStyleObj = {},
        listTitleObj = {},
        listTitleIconObj = {},
        listTitleNameObj = {},
        articleTitleObject = {},
        articleObject = {},
        articleUnitObject = {},
        nameObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key]
          if (!element && element !== false && element != 0) {
            continue
          }
          switch (key) {
            case 'width':
              styleObject['width'] = element;
              break
            case 'height':
              styleObject['height'] = element;
              break
            case 'maxHeight':
              styleObject['max-height'] = element;
              break
            case 'ulbox':
              IDM.style.setBoxStyle(styleObject, element)
              break
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8;
              break
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break
            case 'boxborder':
              IDM.style.setBorderStyle(styleObject, element);
              break
            case 'libox':
              IDM.style.setBoxStyle(liObject, element)
              break
            case 'liBgColor':
              liObject['background-color'] = element && element.hex8;
              break
            case 'liBoxShadow':
              liObject['box-shadow'] = element;
              break
            case 'liBoxborder':
              IDM.style.setBorderStyle(liObject, element);
              break
            case 'titleBox':
              IDM.style.setBoxStyle(titleObject, element);
              break
            case 'titleBorder':
              IDM.style.setBorderStyle(titleObject, element);
              break
            case 'titleStyle':
              IDM.style.setFontStyle(titleNameObject, element);
              break
            case 'titleIconFontColor':
              tipsStyleObj['color'] = element.hex;
              tipsStyleObj["fill"] = element.hex;
              break
            case 'titleIconFontSize':
              tipsStyleObj['font-size'] = element + 'px';
              tipsStyleObj['width'] = element + 'px';
              tipsStyleObj['height'] = element + 'px';
              break
            case 'listTitleStyle':
              IDM.style.setFontStyle(listTitleNameObj, element);
              break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail", styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail .task-li", liObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail .task-title", titleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail .task-title .task-title-font", titleNameObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail .task-title .task-title-icon", tipsStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail .task-li .task-li-title .task-li-content", listTitleNameObj);
      if (this.propData.showHideIcon == 'left') {
        const obj = {
          width: this.propData.showLeftWidth
        }
        window.IDM.setStyleToPageHead(this.moduleObject.id + " .taskdetail .task-li .task-namelefticon", obj);
      }
    },
    /**
     * 通用的url参数对象
     * 所有地址url参数转换
     */
    commonParam() {
      let urlObject = IDM.url.queryObject();
      return {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
    *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
    *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
    *  data:"数据集，内容为：字符串 or 数组 or 对象"
    * }
    */
   setContextValue(object) {
      console.log("统一接口设置的值", object);
      if (object.type != "pageCommonInterface") {
        return;
      }
      if (object.key == this.propData.dataName) {
        let filedExp = this.propData.dataFiled;
        filedExp = this.propData.dataName +
          (filedExp.startsWiths('[')? "" : ".") +
          filedExp;
        let dataObject = { IDM: window.IDM };
        dataObject[this.propData.dataName] = object.data;
        const _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
        console.log(_defaultVal, '页面接口结果')
        this.list = _defaultVal;
      }
   },
   /**
     * 组件通信：接收消息的方法
     * @param {
   *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
   * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
   *  message:{发送的时候传输的消息对象数据}
   *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
   *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
   * } object
   */
    receiveBroadcastMessage(object) {
      console.log('ItasklistDetail接收消息', object);
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
    *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
    * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
    *  message:{实际的消息对象},
    *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
    *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
    *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
    * } object
    */
   sendBroadcastMessage(object) {
     window.IDM.broadcast && window.IDM.broadcast.send(object);
   },
    /**
     * @Desc 设置主题
     */
    convertThemeListAttrToStyleObject() {
      var themeList = this.propData.themeList;
      if (!themeList) {
          return
      }
      const themeNamePrefix =
          IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
              ? IDM.setting.applications.themeNamePrefix
              : 'idm-theme-'
      for (var i = 0; i < themeList.length; i++) {
          var item = themeList[i]
          let bulletBgColorObj = {
              'color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
              'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
          let bulletBgObj = {
            'color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
            'fill': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
          let buttonBgObj = {
            'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
          IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .task-title`, bulletBgColorObj)
          IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .task-right-icon svg`, bulletBgObj)
          IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .task-right-icon button`, buttonBgObj)
          IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .task-icon`, bulletBgObj)
          IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .task-title-icon`, bulletBgObj)
      }
    }
  }
}