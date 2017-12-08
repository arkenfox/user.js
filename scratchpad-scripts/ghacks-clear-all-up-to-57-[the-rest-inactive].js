/***

 This will reset EVERYTHING that is INACTIVE in the ghacks user.js
 release 57-alpha master, but excludes the following:
 - prefs removed since publishing on github
 - e10s section 1100
 - privacy.resistFingerprinting alternatives sections 4600 & 4700
 - deprecated section 9999

 It does not matter if you clear everything, as a restart will reapply your user.js
 Total 478 prefs from 57-alpha master: 119 inactive, 359 active
 These have been broken into two scripts for convenience
 
 For instructions see:
 https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.6-Bulk-Pref-Resetting-[Scratchpad]

***/
 
(function() {
  let ops = [
    '_user.js.parrot',
    /* 119 INACTIVE prefs in 57-alpha master */
    'accessibility.typeaheadfind',
    'app.update.enabled',
    'browser.cache.memory.capacity',
    'browser.cache.memory.enable',
    'browser.chrome.favicons',
    'browser.chrome.site_icons',
    'browser.download.autohideButton',
    'browser.privatebrowsing.autostart',
    'browser.safebrowsing.allowOverride',
    'browser.safebrowsing.blockedURIs.enabled',
    'browser.safebrowsing.downloads.enabled',
    'browser.safebrowsing.downloads.remote.block_dangerous',
    'browser.safebrowsing.downloads.remote.block_dangerous_host',
    'browser.safebrowsing.downloads.remote.block_potentially_unwanted',
    'browser.safebrowsing.downloads.remote.block_uncommon',
    'browser.safebrowsing.malware.enabled',
    'browser.safebrowsing.phishing.enabled',
    'browser.safebrowsing.provider.google.gethashURL',
    'browser.safebrowsing.provider.google.updateURL',
    'browser.safebrowsing.provider.google4.gethashURL',
    'browser.safebrowsing.provider.google4.updateURL',
    'browser.safebrowsing.provider.mozilla.gethashURL',
    'browser.safebrowsing.provider.mozilla.updateURL',
    'browser.sessionhistory.max_total_viewers',
    'browser.startup.page',
    'browser.stopReloadAnimation.enabled',
    'browser.storageManager.enabled',
    'browser.tabs.loadBookmarksInTabs',
    'browser.urlbar.autocomplete.enabled',
    'browser.urlbar.maxRichResults',
    'clipboard.autocopy',
    'dom.event.contextmenu.enabled',
    'dom.indexedDB.enabled',
    'dom.presentation.controller.enabled',
    'dom.presentation.discoverable',
    'dom.presentation.discovery.enabled',
    'dom.presentation.enabled',
    'dom.presentation.receiver.enabled',
    'dom.presentation.session_transport.data_channel.enable',
    'dom.storage.enabled',
    'dom.storageManager.enabled',
    'dom.vr.enabled',
    'extensions.screenshots.disabled',
    'extensions.systemAddon.update.url',
    'extensions.update.enabled',
    'font.name.monospace.x-unicode',
    'font.name.monospace.x-western',
    'font.name.sans-serif.x-unicode',
    'font.name.sans-serif.x-western',
    'font.name.serif.x-unicode',
    'font.name.serif.x-western',
    'font.system.whitelist',
    'full-screen-api.warning.delay',
    'full-screen-api.warning.timeout',
    'general.autoScroll',
    'geo.wifi.logging.enabled',
    'gfx.direct2d.disabled',
    'javascript.options.baselinejit',
    'javascript.options.ion',
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
    'network.cookie.lifetime.days',
    'network.cookie.lifetimePolicy',
    'network.dns.disableIPv6',
    'network.dnsCacheEntries',
    'network.dnsCacheExpiration',
    'network.http.fast-fallback-to-IPv4',
    'offline-apps.quota.warn',
    'permissions.memory_only',
    'places.history.enabled',
    'plugin.state.flash',
    'privacy.clearOnShutdown.openWindows',
    'privacy.cpd.downloads',
    'privacy.cpd.openWindows',
    'privacy.resistFingerprinting.block_mozAddonManager',
    'privacy.trackingprotection.annotate_channels',
    'privacy.trackingprotection.enabled',
    'privacy.trackingprotection.lower_network_priority',
    'privacy.trackingprotection.pbmode.enabled',
    'privacy.usercontext.about_newtab_segregation.enabled',
    'privacy.userContext.enabled',
    'privacy.userContext.longPressBehavior',
    'privacy.userContext.ui.enabled',
    'privacy.window.maxInnerHeight',
    'privacy.window.maxInnerWidth',
    'reader.parse-on-load.enabled',
    'security.mixed_content.block_display_content',
    'security.nocertdb',
    'security.ssl.require_safe_negotiation',
    'security.ssl3.dhe_rsa_aes_128_sha',
    'security.ssl3.dhe_rsa_aes_256_sha',
    'security.ssl3.ecdhe_ecdsa_aes_128_sha',
    'security.ssl3.ecdhe_rsa_aes_128_sha',
    'security.ssl3.rsa_aes_128_sha',
    'security.ssl3.rsa_aes_256_sha',
    'security.ssl3.rsa_des_ede3_sha',
    'services.blocklist.addons.collection',
    'services.blocklist.gfx.collection',
    'services.blocklist.onecrl.collection',
    'services.blocklist.plugins.collection',
    'signon.rememberSignons',
    'svg.disabled',
    'toolkit.cosmeticAnimations.enabled',
    'urlclassifier.trackingTable", "test-track-simple,base-track-digest256',
    'urlclassifier.trackingTable", "test-track-simple,base-track-digest256,content-track-digest256',
    'xpinstall.signatures.required'
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
