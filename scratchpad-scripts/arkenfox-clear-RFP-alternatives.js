/***
  Version: up to and including FF/ESR78

  This will reset the preferences that are under sections 4600 & 4700 in the
  arkenfox user.js. These are the prefs that are no longer necessary, or they
  conflict with, privacy.resistFingerprinting if you have that enabled.

  For instructions see:
  https://github.com/arkenfox/user.js/wiki/3.1-Resetting-Inactive-Prefs-[Scripts]
***/

(() => {

  if ('undefined' === typeof(Services)) return alert('about:config needs to be the active tab!');

  const aPREFS = [
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
    'dom.w3c_pointer_events.enabled',
    'ui.use_standins_for_native_colors',
    'ui.systemUsesDarkTheme',
    'ui.prefersReducedMotion',
    /* section 4700 */
    'general.useragent.override',
    'general.buildID.override',
    'general.appname.override',
    'general.appversion.override',
    'general.platform.override',
    'general.oscpu.override',
    /* reset parrot: check your open about:config after running the script */
    '_user.js.parrot'
  ];

  console.clear();

  let c = 0;
  for (const sPname of aPREFS) {
    if (Services.prefs.prefHasUserValue(sPname)) {
      Services.prefs.clearUserPref(sPname);
      if (!Services.prefs.prefHasUserValue(sPname)) {
        console.info('reset', sPname);
        c++;
      } else console.warn('failed to reset', sPname);
    }
  }

  focus();

  const d = (c==1) ? ' pref' : ' prefs';
  alert(c ? 'successfully reset ' + c + d + "\n\nfor details check the console" : 'nothing to reset');

  return 'all done';

})();

