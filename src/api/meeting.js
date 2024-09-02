export default{
  /**
   * @Desc 意见反馈
   * @Author hjp
   */
  async ApiIdearBack({file, content, params}) {
    let formdata = new FormData();
    for(let i=0; i<file.length; i++) {
      let fid = file[i]
      formdata.append('file', fid)
    }
    // noticeId && formdata.append('noticeId', noticeId)
    content && formdata.append('content', content)
    if (params) {
      Object.keys(params).forEach(item => {
        formdata.append(item, params[item])
      })
    }
    const { data } = await window.IDM.http.post('ctrl/feedbackExt/feedback', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  }
}