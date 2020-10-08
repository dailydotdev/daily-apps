/**
 * Lightweight script to detect whether the browser is running in Private mode.
 * @returns {Promise<boolean>}
 *
 */
export function isPrivateMode() {
    return new Promise(function detect(resolve) {
      var yes = function() { resolve(true); }; // is in private mode
      var not = function() { resolve(false); }; // not in private mode
  
      function detectChromeOpera() {
        // https://developers.google.com/web/updates/2017/08/estimating-available-storage-space
        var isChromeOpera = /(?=.*(opera|chrome)).*/i.test(navigator.userAgent) && navigator.storage && navigator.storage.estimate;
        if (isChromeOpera) {
          navigator.storage.estimate().then(function(data) {
            return data.quota < 120000000 ? yes() : not();
          });
        }
        return !!isChromeOpera;
      }
  
      function detectFirefox() {
        var isMozillaFirefox = 'MozAppearance' in document.documentElement.style;
        if (isMozillaFirefox) {
          if (indexedDB == null) yes();
          else {
            var db = indexedDB.open('inPrivate');
            db.onsuccess = not;
            db.onerror = yes;
          }
        }
        return isMozillaFirefox;
      }
  
      function detectEdgeIE10() {
        var isEdgeIE10 = !window.indexedDB && (window.PointerEvent || window.MSPointerEvent);
        if (isEdgeIE10) yes();
        return !!isEdgeIE10;
      }
  
      // when a browser is detected, it runs tests for that browser
      // and skips pointless testing for other browsers.
      if (detectChromeOpera()) return;
      if (detectFirefox()) return;
      if (detectSafari()) return;
      if (detectEdgeIE10()) return;
      
      // default navigation mode
      return not();
    });
  }
  