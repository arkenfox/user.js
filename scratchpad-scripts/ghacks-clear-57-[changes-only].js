
(function() {
  let ops = [
    '_user.js.parrot',
    /* --- 57-alpha --- */
    /* commented out */
    'browser.storageManager.enabled',
    'dom.storageManager.enabled',
    /* removed from the user.js */
    'browser.search.geoip.timeout',
    'geo.wifi.xhr.timeout',
    'gfx.layerscope.enabled',
    'media.webspeech.recognition.enable',
    /* moved to RFP ALTERNATIVES */
    'dom.w3c_touch_events.enabled',
    'media.video_stats.enabled',
    /* moved to DEPRECATED/REMOVED */
    'browser.bookmarks.showRecentlyBookmarked',
    'browser.casting.enabled',
    'devtools.webide.autoinstallFxdtAdapters',
    'media.eme.chromium-api.enabled',
    'social.directories',
    'social.enabled',
    'social.remote-install.enabled',
    'social.share.activationPanelEnabled',
    'social.shareDirectory',
    'social.toast-notifications.enabled',
    'social.whitelist'
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
