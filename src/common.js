

export function proxyUrl (url) {
  // url can be string or URL
  return(url && url.toString().replace(/https?:\/\//, "/proxy/"))
}
