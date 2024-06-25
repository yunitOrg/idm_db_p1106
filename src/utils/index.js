/**
 * 打开新窗口
 * @param {string} url
 */
export async function openWindow (url) {
  const link =  document.createElement('iframe')
  link.src = IDM.url.getWebPath(url);
  link.style.width = '0px';
  link.style.height = '0px';
  link.style.display = 'none'
  document.body.appendChild(link);
  // document.body.removeChild(link);
}