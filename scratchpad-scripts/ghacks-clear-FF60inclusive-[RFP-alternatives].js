/***
 This will reset the preferences that are under sections 4600 & 4700 in the ghacks user.js
 up to and including release 60-beta. These are the prefs that are no longer necessary,
 or they conflict with, privacy.resistFingerprinting if you have that enabled.

 For instructions see:
 https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.1-Resetting-Inactive-Prefs-[Scripts]
***/
 
(function() {
  let ops = [
    /* section 4600 */
    'dom.maxHardwareConcurrency',
    'dom.enable_resource_timing',
    'dom.enable_performance',
    'device.sensors.enabled',
    'browser.zoom.siteSpecific',
    'dom.gamepad.enabled',
    'dom.netinfo.enabled',
    'media.webspeech.synth.enabled',
    'media.video_stats.enabled',
    'dom.w3c_touch_events.enabled',
    'media.ondevicechange.enabled',
    'webgl.enable-debug-renderer-info',
    /* section 4700 */
    'general.useragent.override',
    'general.buildID.override',
    'general.appname.override',
    'general.appversion.override',
    'general.platform.override',
    'general.oscpu.override',
    /* reset parrot: check your open about:config after running the script */
    '_user.js.parrot'
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
