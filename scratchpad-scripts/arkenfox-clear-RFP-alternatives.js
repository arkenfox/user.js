/***
  This will reset the preferences that are under sections 4600 & 4700 in the
  arkenfox user.js. These are the prefs that are no longer necessary, or they
  conflict with, privacy.resistFingerprinting if you have that enabled.

  Last updated: 08-July-2021

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
    'media.navigator.enabled',
    'media.ondevicechange.enabled',
    'webgl.enable-debug-renderer-info',
    'ui.prefersReducedMotion',
    'dom.w3c_pointer_events.enabled', // deprecated FF87
    'ui.use_standins_for_native_colors',
    'ui.systemUsesDarkTheme',
    'dom.webaudio.enabled',
    'layout.css.font-visibility.level',
    /* section 4700 */
    'general.appname.override',
    'general.appversion.override',
    'general.buildID.override',
    'general.oscpu.override',
    'general.platform.override',
    'general.useragent.override',
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

