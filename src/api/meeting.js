export default{
  /**
    * @Desc 会议申请-获取会议室查询项
    * @Author hjp
    */
  async ApiGetItemsByMetting() {
    const { data } = await window.IDM.http.get('ctrl/meetingPortal/getQueryItemsByMettingRoom', {},{
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return data
  },
  /**
    * @Desc 会议申请-会议室自定义时间段
    * @Author hjp
    */
  async ApiSetTimeSetup(startTime, endTime) {
    let params = {
      "230607151556KDQoY3pTZ37mACgq0TP": [{"key": "value", "value": startTime}],
      "230607151651cAj7TbeUtWe2SQsFVwe": [{"key": "value", "value": endTime}]
    }
    let formdata = new FormData();
    formdata.append('data', JSON.stringify(params))
    formdata.append('mainCatagory', 4)
    const { data } = await window.IDM.http.post('ctrl/configsetup/save', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  },
  /**
    * @Desc 会议申请-会议室自定义时间段
    * @Author hjp
    */
  async ApiGetMeetingRoom() {
    const { data } = await window.IDM.http.get('ctrl/meetingPortal/getCustomTimePeriodsByMettingRoom', {}, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return data
  },
  /**
    * @Desc 会议申请-日-会议室使用信息
    * @Author hjp
    */
  async ApiMeetingDayRoomList({buildingType, siteType, rnrsValue, showTime, freeTime, checkedIdle}) {
    let formdata = new FormData();
    formdata.append('buildingType', buildingType)
    formdata.append('siteType', siteType)
    formdata.append('rnrsValue', rnrsValue)
    formdata.append('showTime', showTime)
    formdata.append('freeTime', freeTime)
    formdata.append('checkedIdle', checkedIdle)
    const { data } = await window.IDM.http.post('ctrl/meetingPortal/getDayUsageInfoByMeetingRoom', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  },
  /**
    * @Desc 会议申请-周-会议室使用信息
    * @Author hjp
    */
  async ApiMeetingWeekRoomList({showStartDate, showEndDate}) {
    let formdata = new FormData();
    formdata.append('showStartDate', showStartDate)
    formdata.append('showEndDate', showEndDate)
    const { data } = await window.IDM.http.post('ctrl/meetingPortal/getWeekUsageInfoByMeetingRoom', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  },
   /**
    * @Desc 会议申请-获取会议室使用信息-会议室
    * @Author hjp
    */
   async ApiMeetingRoomData() {
    const { data } = await window.IDM.http.get('ctrl/meetingPortal/getMeetingRoomData', {}, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return data
  },
  /**
    * @Desc 会议申请-获取会议室使用信息-会议室
    * @Author hjp
    */
  async ApiMeetingInfoRoom({showStartDate, showEndDate, roomId}) {
    let formdata = new FormData();
    formdata.append('showStartDate', showStartDate)
    formdata.append('showEndDate', showEndDate)
    formdata.append('roomId', roomId)
    const { data } = await window.IDM.http.post('ctrl/meetingPortal/getRoomUsageInfoByMeetingRoom', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  },
  /**
   * @Desc 会议申请-会议
   */
  
  async ApiMeetingAllDept({moduleId}) {
    let formdata = new FormData();
    formdata.append('moduleId', moduleId)
    const { data } = await window.IDM.http.post('ctrl/newFile/getAllDept', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  }
}