


const win = window || undefined;

function getDOMElement(url, async) {
  const document = win.document;
  const head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.async = async;
  script.src = url;
  return { head, script };
}


export function loadGAPIClient(url) {
  if(!url) {
    throw("loadGAPI needs an url");
  }
  return new Promise((resolve, reject) => {
    win.sload = () => {
      resolve('loaded');
    }
    let u = url + 'sload';
    let {head, script} = getDOMElement(u)
    script.onload = () => {
      script.onerror = script.onload = null;
    }

    script.onerror = (e) => obs.error(e);
    head.appendChild(script);
  });
}
