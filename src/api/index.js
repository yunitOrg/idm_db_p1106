export default {
    // 获取系统配置
    handleGetSystemSetting(key) {
        return IDM.http.getSync('/ctrl/idm/form/getSysConfigInfo', { key })
    },
    /**
    * @Desc 督办-台账列表
    * @Author hjp
    */
    async ApiGetDBList({whQuery, contentQuery, approvalType, dbStatus, startDate, endDate, pageNo, pageSize}) {
      const { data } = await window.IDM.http.post('ctrl/dbApproval/getApprovalList', {whQuery, contentQuery, approvalType, dbStatus, startDate, endDate, pageNo, pageSize}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-获取台账督办类型下拉框
     * @Author hjp
     */
    async ApiPprovalTypeSelect() {
      const { data } = await window.IDM.http.post('ctrl/dbApproval/getApprovalTypeSelect',  {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-获取台账项目状态下拉框
     * @Author hjp
     */
    async ApiDbStatusSelect() {
      const { data } = await window.IDM.http.post('ctrl/dbApproval/getDbStatusSelect',  {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-根据立项id获取任务
     * @Author hjp
     */
    async ApigetTaskApproval({approvalId}) {
      const { data } = await window.IDM.http.get(`ctrl/dbTask/getTaskByApprovalId`, {approvalId: approvalId}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-根据立项id获取通知
     * @Author hjp
     */
    async ApiGetMsgApproval({taskId}) {
      const { data } = await window.IDM.http.get(`ctrl/dbNotice/getNoticeByTaskId`, {taskId: taskId}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-获取通知反馈历史
     * @Author hjp
     */
    async ApiGetHistoryFeed({noticeId}) {
      const { data } = await window.IDM.http.get(`ctrl/dbFeedback/getHistoryFeedbackByNoticeId`, {noticeId: noticeId}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-获取督办立项数据
     * @Author hjp
     */
    async ApiDbstatisProjectList({startDate, endDate}) {
      const { data } = await window.IDM.http.get(`ctrl/dbStatistics/project`, {startDate: startDate, endDate: endDate}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-获取督办数据
     * @Author hjp
     */
    async ApiProjectTypeList({startDate, endDate}) {
      const { data } = await window.IDM.http.get(`ctrl/dbStatistics/project/type`, {startDate: startDate, endDate: endDate}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-项目统计-导出
     * @Author hjp
     */
    async ApiProjectExport({startDate, endDate}) {
      const { data } = await window.IDM.http.get(`/ctrl/dbStatistics/project/export`, {startDate: startDate, endDate: endDate}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
    /**
     * @Desc 督办-统计-导出
     * @Author hjp
     */
    async ApiDbExport({startDate, endDate}) {
      const { data } = await window.IDM.http.get(`/ctrl/dbStatistics/project/type/export`, {startDate: startDate, endDate: endDate}, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return data
    },
}