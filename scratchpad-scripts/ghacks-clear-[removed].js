/***
 This will reset the preferences that have been removed completely from the ghacks user.js.

 Last updated: 30-Sept-2018

 For instructions see:
 https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.1-Resetting-Inactive-Prefs-[Scripts]
***/
 
(function() {
  let ops = [
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
    'gfx.layerscope.enabled', // default is false anyway
    /* 58-alpha */
    //  excluding these e10 settings
       // 'browser.tabs.remote.autostart',
       // 'browser.tabs.remote.autostart.2',
       // 'browser.tabs.remote.force-enable',
       // 'browser.tabs.remote.separateFileUriProcess',
       // 'extensions.e10sBlocksEnabling',
       // 'extensions.webextensions.remote',
       // 'dom.ipc.processCount',
       // 'dom.ipc.shims.enabledWarnings',
       // 'dom.ipc.processCount.extension',
       // 'dom.ipc.processCount.file',
       // 'security.sandbox.content.level',
       // 'dom.ipc.plugins.sandbox-level.default',
       // 'dom.ipc.plugins.sandbox-level.flash',
       // 'security.sandbox.logging.enabled',
    'dom.presentation.controller.enabled',
    'dom.presentation.discoverable',
    'dom.presentation.discovery.enabled',
    'dom.presentation.enabled',
    'dom.presentation.receiver.enabled',
    'dom.presentation.session_transport.data_channel.enable',
    /* 59-alpha */
    'browser.stopReloadAnimation.enabled',
    'browser.tabs.insertRelatedAfterCurrent',
    'browser.tabs.loadDivertedInBackground',
    'browser.tabs.loadInBackground',
    'browser.tabs.selectOwnerOnClose',
    'browser.urlbar.clickSelectsAll',
    'browser.urlbar.doubleClickSelectsAll',
    'media.flac.enabled',
    'media.mediasource.enabled',
    'media.mediasource.mp4.enabled',
    'media.mediasource.webm.audio.enabled',
    'media.mediasource.webm.enabled',
    'media.mp4.enabled',
    'media.ogg.enabled',
    'media.ogg.flac.enabled',
    'media.opus.enabled',
    'media.raw.enabled',
    'media.wave.enabled',
    'media.webm.enabled',
    'media.wmf.amd.vp9.enabled',
    'media.wmf.enabled',
    'media.wmf.vp9.enabled',
    'ui.submenuDelay',
    /* 60-beta - these were all at default anyway */
    'device.storage.enabled',
    'general.useragent.compatMode.firefox',
    'network.dns.blockDotOnion',
    'network.stricttransportsecurity.preloadlist',
    'security.block_script_with_wrong_mime',
    'security.fileuri.strict_origin_policy',
    'security.sri.enable',
    /* 61-beta */
    'browser.laterrun.enabled',
    'browser.offline-apps.notify',
    'browser.rights.3.shown',
    'browser.slowStartup.maxSamples',
    'browser.slowStartup.notificationDisabled',
    'browser.slowStartup.samples',
    'browser.storageManager.enabled',
    'dom.allow_scripts_to_close_windows',
    'dom.disable_window_flip',
    'network.http.fast-fallback-to-IPv4',
    'offline-apps.quota.warn',
    'services.blocklist.signing.enforced',
    /* 62-beta */
    'browser.urlbar.autoFill.typed',
    'security.tls.version.fallback-limit',
    /* 63-beta */
    'extensions.webextensions.keepStorageOnUninstall',
    'extensions.webextensions.keepUuidOnUninstall',
    'privacy.trackingprotection.ui.enabled',
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
