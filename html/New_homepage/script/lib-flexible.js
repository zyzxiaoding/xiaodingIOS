(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    var bodyFontSize = localStorage.getItem('bodyFontSize');
    if(bodyFontSize) {
        if (document.body) {
          document.body.style.fontSize = bodyFontSize + 'px';
        }
        else {
          document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    } else {
        if (document.body) {
          document.body.style.fontSize = (12 * dpr) + 'px'
        }
        else {
          document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    // 避免APICloud窗口机制对框架的影响，获取全局唯一尺寸
    var htmlFontSize = localStorage.getItem('htmlFontSize');
    if(htmlFontSize) {
        docEl.style.fontSize = htmlFontSize + 'px';
    } else {
        var rem = docEl.clientWidth / 10
        docEl.style.fontSize = rem + 'px'
    }
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
