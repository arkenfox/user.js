/***

 This will reset the preferences that have been removed completely
 from the ghacks user.js up to and including release 57-alpha

 For instructions see:
 https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.6-Bulk-Pref-Resetting-[Scratchpad]

***/
 
(function() {
  let ops = [
    '_user.js.parrot',
    /* removed in ghacks user.js v52-57 */
    /* 52-alpha */
    'browser.search.reset.enabled',
    'browser.search.reset.whitelist',
    /* 54-alpha */
    'browser.migrate.automigrate.enabled',
    'services.sync.enabled',
    'webextensions.storage.sync.enabled',
    'webextensions.storage.sync.serverURL',
    /* 55-alpha */
    'dom.keyboardevent.dispatch_during_composition', // default is false anyway
    'dom.vr.oculus.enabled', // covered by dom.vr.enabled
    'dom.vr.openvr.enabled', // ditto
    'dom.vr.osvr.enabled', // ditto
    'extensions.pocket.api', // covered by extensions.pocket.enabled
    'extensions.pocket.oAuthConsumerKey', // ditto
    'extensions.pocket.site', // ditto
    /* 56-alpha: none */
    /* 57-alpha */
    'geo.wifi.xhr.timeout', // covered by geo.enabled
    'browser.search.geoip.timeout', // ditto
    'media.webspeech.recognition.enable', // default is false anyway
    'gfx.layerscope.enabled' // default is false anyway
  ]

  if("undefined" === typeof(Services)) {
    alert("about:config needs to be the active tab!");
    return;
  }
  
  let c = 0;
  for (let i = 0, len = ops.length; i < len; i++) {
    if (Services.prefs.prefHasUserValue(ops[i])) {   
      Services.prefs.clearUserPref(ops[i]);
      if (!Services.prefs.prefHasUserValue(ops[i])) {
        console.log("reset", ops[i]);
        c++;
      } else { console.log("failed to reset", ops[i]); }
    }
  }
  
  focus();
  
  let d = (c==1) ? " pref" : " prefs";
  if (c > 0) {
    alert("successfully reset " + c + d + "\n\nfor details check the Browser Console (Ctrl+Shift+J)");
  } else { alert("nothing to reset"); }
  
})();
