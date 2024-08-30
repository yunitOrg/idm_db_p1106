export default{
  /**
   * @Desc 意见反馈
   * @Author hjp
   */
  async ApiIdearBack({noticeId, file, content}) {
    let formdata = new FormData();
    for(let i=0; i<file.length; i++) {
      let fid = file[i]
      formdata.append('file', fid)
    }
    noticeId && formdata.append('noticeId', noticeId)
    content && formdata.append('content', content)
    const { data } = await window.IDM.http.post('ctrl/feedbackExt/feedback', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return data
  }
}