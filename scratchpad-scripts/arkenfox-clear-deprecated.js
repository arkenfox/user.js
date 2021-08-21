/***
  Version: up to and including FF/ESR91

  This will reset the preferences that have been deprecated by Mozilla
  and used in the arkenfox user.js

  It is in reverse order, so feel free to remove sections that do not apply

  For instructions see:
  https://github.com/arkenfox/user.js/wiki/3.1-Resetting-Inactive-Prefs-[Scripts]
***/

(() => {

  if ('undefined' === typeof(Services)) return alert('about:config needs to be the active tab!');

  const aPREFS = [
    /* deprecated */
    /* FF79-91 */
    'browser.cache.offline.storage.enable',
    'browser.download.hide_plugins_without_extensions',
    'browser.library.activity-stream.enabled',
    'browser.search.geoSpecificDefaults',
    'browser.search.geoSpecificDefaults.url',
    'dom.ipc.plugins.flash.subprocess.crashreporter.enabled',
    'dom.ipc.plugins.reportCrashURL',
    'dom.w3c_pointer_events.enabled',
    'intl.charset.fallback.override',
    'network.ftp.enabled',
    'plugin.state.flash',
    'security.mixed_content.block_object_subrequest',
    'security.ssl.errorReporting.automatic',
    'security.ssl.errorReporting.enabled',
    'security.ssl.errorReporting.url',
    /* 69-78 */
    'browser.newtabpage.activity-stream.telemetry.ping.endpoint',
    'browser.tabs.remote.allowLinkedWebInFileUriProcess',
    'browser.urlbar.oneOffSearches',
    'devtools.webide.autoinstallADBExtension',
    'devtools.webide.enabled',
    'dom.indexedDB.enabled',
    'extensions.blocklist.url',
    'geo.wifi.logging.enabled',
    'geo.wifi.uri',
    'gfx.downloadable_fonts.woff2.enabled',
    'media.autoplay.allow-muted',
    'media.autoplay.enabled.user-gestures-needed',
    'offline-apps.allow_by_default',
    'plugins.click_to_play',
    'privacy.userContext.longPressBehavior',
    'toolkit.cosmeticAnimations.enabled',
    'toolkit.telemetry.hybridContent.enabled',
    'webgl.disable-extensions',
    /* 61-68 */
    'app.update.enabled',
    'browser.aboutHomeSnippets.updateUrl',
    'browser.chrome.errorReporter.enabled',
    'browser.chrome.errorReporter.submitUrl',
    'browser.chrome.favicons',
    'browser.ctrlTab.previews',
    'browser.fixup.hide_user_pass',
    'browser.newtabpage.activity-stream.asrouter.userprefs.cfr',
    'browser.newtabpage.activity-stream.disableSnippets',
    'browser.onboarding.enabled',
    'browser.search.countryCode',
    'browser.urlbar.autocomplete.enabled',
    'devtools.webide.adbAddonURL',
    'devtools.webide.autoinstallADBHelper',
    'dom.event.highrestimestamp.enabled',
    'experiments.activeExperiment',
    'experiments.enabled',
    'experiments.manifest.uri',
    'experiments.supported',
    'lightweightThemes.update.enabled',
    'media.autoplay.enabled',
    'network.allow-experiments',
    'network.cookie.lifetime.days',
    'network.jar.block-remote-files',
    'network.jar.open-unsafe-types',
    'plugin.state.java',
    'security.csp.enable_violation_events',
    'security.csp.experimentalEnabled',
    'shield.savant.enabled',
    /* 60 or earlier */
    'browser.bookmarks.showRecentlyBookmarked',
    'browser.casting.enabled',
    'browser.crashReports.unsubmittedCheck.autoSubmit',
    'browser.formautofill.enabled',
    'browser.formfill.saveHttpsForms',
    'browser.fullscreen.animate',
    'browser.history.allowPopState',
    'browser.history.allowPushState',
    'browser.history.allowReplaceState',
    'browser.newtabpage.activity-stream.enabled',
    'browser.newtabpage.directory.ping',
    'browser.newtabpage.directory.source',
    'browser.newtabpage.enhanced',
    'browser.newtabpage.introShown',
    'browser.pocket.api',
    'browser.pocket.enabled',
    'browser.pocket.oAuthConsumerKey',
    'browser.pocket.site',
    'browser.polaris.enabled',
    'browser.safebrowsing.appRepURL',
    'browser.safebrowsing.enabled',
    'browser.safebrowsing.gethashURL',
    'browser.safebrowsing.malware.reportURL',
    'browser.safebrowsing.provider.google.appRepURL',
    'browser.safebrowsing.reportErrorURL',
    'browser.safebrowsing.reportGenericURL',
    'browser.safebrowsing.reportMalwareErrorURL',
    'browser.safebrowsing.reportMalwareMistakeURL',
    'browser.safebrowsing.reportMalwareURL',
    'browser.safebrowsing.reportPhishMistakeURL',
    'browser.safebrowsing.reportURL',
    'browser.safebrowsing.updateURL',
    'browser.search.showOneOffButtons',
    'browser.selfsupport.enabled',
    'browser.selfsupport.url',
    'browser.sessionstore.privacy_level_deferred',
    'browser.tabs.animate',
    'browser.trackingprotection.gethashURL',
    'browser.trackingprotection.updateURL',
    'browser.urlbar.unifiedcomplete',
    'browser.usedOnWindows10.introURL',
    'camera.control.autofocus_moving_callback.enabled',
    'camera.control.face_detection.enabled',
    'datareporting.healthreport.about.reportUrl',
    'datareporting.healthreport.about.reportUrlUnified',
    'datareporting.healthreport.documentServerURI',
    'datareporting.healthreport.service.enabled',
    'datareporting.policy.dataSubmissionEnabled.v2',
    'devtools.webide.autoinstallFxdtAdapters',
    'dom.archivereader.enabled',
    'dom.battery.enabled',
    'dom.beforeAfterKeyboardEvent.enabled',
    'dom.disable_image_src_set',
    'dom.disable_window_open_feature.scrollbars',
    'dom.disable_window_status_change',
    'dom.enable_user_timing',
    'dom.flyweb.enabled',
    'dom.idle-observers-api.enabled',
    'dom.keyboardevent.code.enabled',
    'dom.network.enabled',
    'dom.push.udp.wakeupEnabled',
    'dom.telephony.enabled',
    'dom.vr.oculus050.enabled',
    'dom.workers.enabled',
    'dom.workers.sharedWorkers.enabled',
    'extensions.formautofill.experimental',
    'extensions.screenshots.system-disabled',
    'extensions.shield-recipe-client.api_url',
    'extensions.shield-recipe-client.enabled',
    'full-screen-api.approval-required',
    'general.useragent.locale',
    'geo.security.allowinsecure',
    'intl.locale.matchOS',
    'loop.enabled',
    'loop.facebook.appId',
    'loop.facebook.enabled',
    'loop.facebook.fallbackUrl',
    'loop.facebook.shareUrl',
    'loop.feedback.formURL',
    'loop.feedback.manualFormURL',
    'loop.logDomains',
    'loop.server',
    'media.block-play-until-visible',
    'media.eme.apiVisible',
    'media.eme.chromium-api.enabled',
    'media.getusermedia.screensharing.allow_on_old_platforms',
    'media.getusermedia.screensharing.allowed_domains',
    'media.gmp-eme-adobe.autoupdate',
    'media.gmp-eme-adobe.enabled',
    'media.gmp-eme-adobe.visible',
    'network.http.referer.userControlPolicy',
    'network.http.sendSecureXSiteReferrer',
    'network.http.spdy.enabled.http2draft',
    'network.http.spdy.enabled.v3-1',
    'network.websocket.enabled',
    'pageThumbs.enabled',
    'pfs.datasource.url',
    'plugin.scan.Acrobat',
    'plugin.scan.Quicktime',
    'plugin.scan.WindowsMediaPlayer',
    'plugins.enumerable_names',
    'plugins.update.notifyUser',
    'plugins.update.url',
    'privacy.clearOnShutdown.passwords',
    'privacy.donottrackheader.value',
    'security.mixed_content.send_hsts_priming',
    'security.mixed_content.use_hsts',
    'security.ssl3.ecdhe_ecdsa_rc4_128_sha',
    'security.ssl3.ecdhe_rsa_rc4_128_sha',
    'security.ssl3.rsa_rc4_128_md5',
    'security.ssl3.rsa_rc4_128_sha',
    'security.tls.insecure_fallback_hosts.use_static_list',
    'security.tls.unrestricted_rc4_fallback',
    'security.xpconnect.plugin.unrestricted',
    'social.directories',
    'social.enabled',
    'social.remote-install.enabled',
    'social.share.activationPanelEnabled',
    'social.shareDirectory',
    'social.toast-notifications.enabled',
    'social.whitelist',
    'toolkit.telemetry.unifiedIsOptIn',

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
