export default{
  /**
   * @Desc 意见反馈
   * @Author hjp
   */
  async ApiIdearBack(params) {
    const { data } = await window.IDM.http.post('ctrl/feedbackExt/feedback', params)
    return data
  }
}