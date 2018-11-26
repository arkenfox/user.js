/***
 This will reset the preferences that have been deprecated by Mozilla
 and used in the ghacks user.js up to and including release 60-beta

 It is in reverse order, so feel free to remove sections that do not apply

 For instructions see:
 https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.1-Resetting-Inactive-Prefs-[Scripts]
***/

(function() {
  let ops = [
    /* deprecated */

    /* ESR52.x users can remove sections 53-60 but it is not
       crucial as your user.js will reinstate them */
    /* 60 */
    'browser.newtabpage.directory.source',
    'browser.newtabpage.enhanced',
    'browser.newtabpage.introShown',
    'extensions.shield-recipe-client.enabled',
    'extensions.shield-recipe-client.api_url',
    'browser.newtabpage.activity-stream.enabled',
    'dom.workers.enabled',
    'view_source.tab',
    /* 59 */
    'intl.locale.matchOS',
    'general.useragent.locale',
    'datareporting.healthreport.about.reportUrl',
    'dom.flyweb.enabled',
    'security.mixed_content.use_hsts',
    'security.mixed_content.send_hsts_priming',
    'network.http.referer.userControlPolicy',
    'security.xpconnect.plugin.unrestricted',
    'media.getusermedia.screensharing.allowed_domains',
    'camera.control.face_detection.enabled',
    'dom.disable_window_status_change',
    'dom.idle-observers-api.enabled',
    /* 58 */
    'browser.crashReports.unsubmittedCheck.autoSubmit',
    /* 57 */
    'social.whitelist',
    'social.toast-notifications.enabled',
    'social.shareDirectory',
    'social.remote-install.enabled',
    'social.directories',
    'social.share.activationPanelEnabled',
    'social.enabled',
    'media.eme.chromium-api.enabled',
    'devtools.webide.autoinstallFxdtAdapters',
    'browser.casting.enabled',
    'browser.bookmarks.showRecentlyBookmarked',
    /* 56 */
    'extensions.screenshots.system-disabled',
    'extensions.formautofill.experimental',
    /* 55 */
    'geo.security.allowinsecure',
    'browser.selfsupport.enabled',
    'browser.selfsupport.url',
    'browser.newtabpage.directory.ping',
    'browser.formfill.saveHttpsForms',
    'browser.formautofill.enabled',
    'dom.enable_user_timing',
    'dom.keyboardevent.code.enabled',
    'browser.tabs.animate',
    'browser.fullscreen.animate',
    /* 54 */
    'browser.safebrowsing.reportMalwareMistakeURL',
    'browser.safebrowsing.reportPhishMistakeURL',
    'media.eme.apiVisible',
    'dom.archivereader.enabled',
    /* 53 */
    'security.tls.unrestricted_rc4_fallback',
    'plugin.scan.Acrobat',
    'plugin.scan.Quicktime',
    'plugin.scan.WindowsMediaPlayer',
    'media.getusermedia.screensharing.allow_on_old_platforms',
    'dom.beforeAfterKeyboardEvent.enabled',
    /* End of ESR52.x section */

    /* 52 */
    'network.http.sendSecureXSiteReferrer',
    'media.gmp-eme-adobe.enabled',
    'media.gmp-eme-adobe.visible',
    'media.gmp-eme-adobe.autoupdate',
    'dom.telephony.enabled',
    'dom.battery.enabled',
    /* 51 */
    'media.block-play-until-visible',
    'dom.vr.oculus050.enabled',
    'network.http.spdy.enabled.v3-1',
    /* 50 */
    'browser.usedOnWindows10.introURL',
    'plugins.update.notifyUser',
    'browser.safebrowsing.enabled',
    'security.ssl3.ecdhe_ecdsa_rc4_128_sha',
    'security.ssl3.ecdhe_rsa_rc4_128_sha',
    'security.ssl3.rsa_rc4_128_md5',
    'security.ssl3.rsa_rc4_128_sha',
    'plugins.update.url',
    /* 49 */
    'loop.enabled',
    'loop.server',
    'loop.feedback.formURL',
    'loop.feedback.manualFormURL',
    'loop.facebook.appId',
    'loop.facebook.enabled',
    'loop.facebook.fallbackUrl',
    'loop.facebook.shareUrl',
    'loop.logDomains',
    'dom.disable_window_open_feature.scrollbars',
    'dom.push.udp.wakeupEnabled',
    /* 48 */
    'browser.urlbar.unifiedcomplete',
    /* 47 */
    'toolkit.telemetry.unifiedIsOptIn',
    'datareporting.healthreport.about.reportUrlUnified',
    'browser.history.allowPopState',
    'browser.history.allowPushState',
    'browser.history.allowReplaceState',
    /* 46 */
    'datareporting.healthreport.service.enabled',
    'datareporting.healthreport.documentServerURI',
    'datareporting.policy.dataSubmissionEnabled.v2',
    'browser.safebrowsing.appRepURL',
    'browser.polaris.enabled',
    'browser.pocket.enabled',
    'browser.pocket.api',
    'browser.pocket.site',
    'browser.pocket.oAuthConsumerKey',
    /* 45 */
    'browser.sessionstore.privacy_level_deferred',
    /* 44 */
    'browser.safebrowsing.provider.google.appRepURL',
    'security.tls.insecure_fallback_hosts.use_static_list',
    'dom.workers.sharedWorkers.enabled',
    'dom.disable_image_src_set',
    /* 43 */
    'browser.safebrowsing.gethashURL',
    'browser.safebrowsing.updateURL',
    'browser.safebrowsing.malware.reportURL',
    'browser.trackingprotection.gethashURL',
    'browser.trackingprotection.updateURL',
    'pfs.datasource.url',
    'browser.search.showOneOffButtons',
    /* 42 and earlier */
    'privacy.clearOnShutdown.passwords', // 42
    'full-screen-api.approval-required', // 42
    'browser.safebrowsing.reportErrorURL', // 41
    'browser.safebrowsing.reportGenericURL', // 41
    'browser.safebrowsing.reportMalwareErrorURL', // 41
    'browser.safebrowsing.reportMalwareURL', // 41
    'browser.safebrowsing.reportURL', // 41
    'plugins.enumerable_names', // 41
    'network.http.spdy.enabled.http2draft', // 41
    'camera.control.autofocus_moving_callback.enabled', // 37
    'privacy.donottrackheader.value', // 36
    'network.websocket.enabled', // 35
    'dom.network.enabled', // 31
    'pageThumbs.enabled', // 25

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
