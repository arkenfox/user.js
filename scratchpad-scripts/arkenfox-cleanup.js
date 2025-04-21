/***
  This will reset the preferences that since FF91 have been
  - removed from the arkenfox user.js
  - deprecated by Mozilla but listed in the arkenfox user.js in the past

  There is an archived version at https://github.com/arkenfox/user.js/issues/123
  if you want the full list since jesus

  Last updated: 21-April-2025

  Instructions:
  - [optional] close Firefox and backup your profile
  - [optional] disable your network connection [1]
  - start Firefox
  - load about:config and press Ctrl+Shift+K to open the Web Console for about:config
    - using about:config is important, so the script has the right permissions
  - paste this script
  - if you edited the list of prefs in the script, make sure the last pref does not have a trailing comma
  - hit enter
  - check the Info output to see which prefs were reset
  - restart
     - some prefs require a restart
     - a restart will reapply your user.js
  - [optional] re-enable your network connection
 
  [1] Blocking Firefox from the internet ensures it cannot act on your reset preferences in the
  period before you restart it, such as app and extension auto-updating, or downloading unwanted
  components (GMP etc). It depends on what you're resetting and how long before you restart.

***/

(() => {

  if ('undefined' === typeof(Services)) return alert('about:config needs to be the active tab!');

  const aPREFS = [
    /* DEPRECATED */
    /* 129-140 */
    'media.ondevicechange.enabled', // 137
    'webchannel.allowObject.urlWhitelist', // 132
    /* 116-128 */
    'browser.contentanalysis.default_allow', // 127
    'browser.messaging-system.whatsNewPanel.enabled', // 126
    'browser.ping-centre.telemetry', // 123
    'dom.webnotifications.serviceworker.enabled', // 117
    'javascript.use_us_english_locale', // 119
    'layout.css.font-visibility.private', // 118
    'layout.css.font-visibility.resistFingerprinting', // 116
    'layout.css.font-visibility.standard', // 118
    'layout.css.font-visibility.trackingprotection', // 118
    'network.dns.skipTRR-when-parental-control-enabled', // 119
    'permissions.delegation.enabled', // 118
    'security.family_safety.mode', // 117
    'widget.non-native-theme.enabled', // 127
    /* 103-115 */
    'browser.cache.offline.enable', // 115
    'extensions.formautofill.heuristics.enabled', // 114
    'network.cookie.lifetimePolicy', // 103 [technically removed in 104]
    'privacy.clearsitedata.cache.enabled', // 114
    'privacy.resistFingerprinting.testGranularityMask', // 114
    'security.pki.sha1_enforcement_level', // 103
    /* 92-102 */
    'browser.urlbar.suggest.quicksuggest', // 95
    'dom.securecontext.whitelist_onions', // 97
    'dom.storage.next_gen', // 102
    'network.http.spdy.enabled', // 100
    'network.http.spdy.enabled.deps',
    'network.http.spdy.enabled.http2',
    'network.http.spdy.websockets',
    'layout.css.font-visibility.level', // 94
    'security.ask_for_password', // 102
    'security.csp.enable', // 99
    'security.password_lifetime', // 102
    'security.ssl3.rsa_des_ede3_sha', // 93

    /* REMOVED */
    /* 129-140 */
    'dom.securecontext.allowlist_onions',
    'network.http.referer.hideOnionSource',
    'privacy.clearOnShutdown.cache',
    'privacy.clearOnShutdown.cookies',
    'privacy.clearOnShutdown.downloads',
    'privacy.clearOnShutdown.formdata',
    'privacy.clearOnShutdown.history',
    'privacy.clearOnShutdown.offlineApps',
    'privacy.clearOnShutdown.sessions',
    'privacy.cpd.cache',
    'privacy.cpd.cookies',
    'privacy.cpd.formdata',
    'privacy.cpd.history',
    'privacy.cpd.offlineApps',
    'privacy.cpd.sessions',
    /* 116-128 */
    'browser.fixup.alternate.enabled',
    'browser.taskbar.previews.enable',
    'browser.urlbar.dnsResolveSingleWordsAfterSearch',
    'geo.provider.network.url',
    'geo.provider.network.logging.enabled',
    'geo.provider.use_gpsd',
    'media.gmp-widevinecdm.enabled',
    'network.protocol-handler.external.ms-windows-store',
    'privacy.partition.always_partition_third_party_non_cookie_storage',
    'privacy.partition.always_partition_third_party_non_cookie_storage.exempt_sessionstorage',
    'privacy.partition.serviceWorkers',
    /* 103-115 */
    'beacon.enabled',
    'browser.startup.blankWindow',
    'browser.newtab.preload',
    'browser.newtabpage.activity-stream.feeds.discoverystreamfeed',
    'browser.newtabpage.activity-stream.feeds.snippets',
    'browser.region.network.url',
    'browser.region.update.enabled',
    'browser.search.region',
    'browser.ssl_override_behavior',
    'browser.tabs.warnOnClose',
    'devtools.chrome.enabled',
    'dom.disable_beforeunload',
    'dom.disable_open_during_load',
    'dom.netinfo.enabled',
    'dom.vr.enabled',
    'extensions.formautofill.addresses.supported',
    'extensions.formautofill.available',
    'extensions.formautofill.creditCards.available',
    'extensions.formautofill.creditCards.supported',
    'middlemouse.contentLoadURL',
    'network.http.altsvc.oe',
    /* 92-102 */
    'browser.urlbar.trimURLs',
    'dom.caches.enabled',
    'dom.storageManager.enabled',
    'dom.storage_access.enabled',
    'dom.targetBlankNoOpener.enabled',
    'network.cookie.thirdparty.sessionOnly',
    'network.cookie.thirdparty.nonsecureSessionOnly',
    'privacy.firstparty.isolate.block_post_message',
    'privacy.firstparty.isolate.restrict_opener_access',
    'privacy.firstparty.isolate.use_site',
    'privacy.window.name.update.enabled',
    'security.insecure_connection_text.enabled',

    /* IMPORTANT: last active pref must not have a trailing comma */ 
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
