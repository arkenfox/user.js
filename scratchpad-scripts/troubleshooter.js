
(function() {

  function reapply(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      switch (arr[i].type) {
        case 32: // string
          Services.prefs.setCharPref(arr[i].name, arr[i].value);
          break;
        case 64: // int
          Services.prefs.setIntPref(arr[i].name, arr[i].value);
          break;
        case 128: // boolean
          Services.prefs.setBoolPref(arr[i].name, arr[i].value);
          break;
        default:
          console.log("error re-appyling value for '"+arr[i].name+"' !"); // should never happen
      }
    }
  }

  function myreset(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      Services.prefs.clearUserPref(arr[i].name);
    }
  }

  let ops = [
    'accessibility.force_disabled',
    'beacon.enabled',
    'browser.cache.disk.capacity',
    'browser.cache.disk.enable',
    'browser.cache.disk.smart_size.enabled',
    'browser.cache.disk.smart_size.first_run',
    'browser.cache.disk_cache_ssl',
    'browser.cache.offline.enable',
    'browser.display.use_document_fonts',
    'browser.download.hide_plugins_without_extensions',
    'browser.download.manager.addToRecentDocs',
    'browser.download.useDownloadDir',
    'browser.fixup.alternate.enabled',
    'browser.formfill.enable',
    'browser.link.open_newwindow.restriction',
    'browser.search.geoip.url',
    'browser.search.geoSpecificDefaults',
    'browser.search.geoSpecificDefaults.url',
    'browser.search.suggest.enabled',
    'browser.send_pings.require_same_host',
    'browser.sessionhistory.max_entries',
    'browser.sessionstore.interval',
    'browser.sessionstore.max_tabs_undo',
    'browser.sessionstore.max_windows_undo',
    'browser.sessionstore.privacy_level',
    'browser.sessionstore.resume_from_crash',
    'browser.shell.shortcutFavicons',
    'browser.storageManager.enabled',
    'browser.tabs.remote.allowLinkedWebInFileUriProcess',
    'browser.taskbar.lists.enabled',
    'browser.taskbar.lists.frequent.enabled',
    'browser.taskbar.lists.tasks.enabled',
    'browser.urlbar.autocomplete.enabled',
    'browser.urlbar.autoFill',
    'browser.urlbar.autoFill.typed',
    'browser.urlbar.decodeURLsOnCopy',
    'browser.urlbar.oneOffSearches',
    'browser.urlbar.speculativeConnect.enabled',
    'browser.urlbar.suggest.searches',
    'browser.urlbar.trimURLs',
    'camera.control.face_detection.enabled',
    'canvas.capturestream.enabled',
    'captivedetect.canonicalURL',
    'dom.caches.enabled',
    'dom.disable_beforeunload',
    'dom.disable_window_move_resize',
    'dom.disable_window_open_feature.close',
    'dom.disable_window_open_feature.menubar',
    'dom.disable_window_open_feature.minimizable',
    'dom.disable_window_open_feature.personalbar',
    'dom.disable_window_open_feature.titlebar',
    'dom.disable_window_open_feature.toolbar',
    'dom.event.clipboardevents.enabled',
    'dom.idle-observers-api.enabled',
    'dom.IntersectionObserver.enabled',
    'dom.popup_allowed_events',
    'dom.popup_maximum',
    'dom.push.connection.enabled',
    'dom.push.enabled',
    'dom.push.serverURL',
    'dom.serviceWorkers.enabled',
    'dom.storageManager.enabled',
    'dom.vibrator.enabled',
    'dom.webaudio.enabled',
    'dom.webnotifications.enabled',
    'dom.webnotifications.serviceworker.enabled',
    'font.blacklist.underline_offset',
    'full-screen-api.enabled',
    'geo.wifi.uri',
    'gfx.downloadable_fonts.woff2.enabled',
    'gfx.font_rendering.graphite.enabled',
    'gfx.font_rendering.opentype_svg.enabled',
    'intl.accept_languages',
    'javascript.options.asmjs',
    'javascript.options.wasm',
    'keyword.enabled',
    'layout.css.font-loading-api.enabled',
    'layout.css.visited_links_enabled',
    'mathml.disabled',
    'media.autoplay.enabled',
    'media.eme.enabled',
    'media.getusermedia.screensharing.allowed_domains',
    'media.getusermedia.screensharing.enabled',
    'media.gmp.trial-create.enabled',
    'media.gmp-manager.url',
    'media.gmp-provider.enabled',
    'media.gmp-widevinecdm.enabled',
    'media.gmp-widevinecdm.visible',
    'media.navigator.enabled',
    'media.navigator.video.enabled',
    'media.ondevicechange.enabled',
    'media.peerconnection.enabled',
    'media.peerconnection.ice.default_address_only',
    'media.peerconnection.ice.no_host',
    'media.peerconnection.ice.tcp',
    'media.peerconnection.identity.enabled',
    'media.peerconnection.identity.timeout',
    'media.peerconnection.turn.disable',
    'media.peerconnection.use_document_iceservers',
    'media.peerconnection.video.enabled',
    'network.auth.subresource-img-cross-origin-http-auth-allow',
    'network.captive-portal-service.enabled',
    'network.cookie.thirdparty.sessionOnly',
    'network.dns.disablePrefetch',
    'network.http.altsvc.enabled',
    'network.http.altsvc.oe',
    'network.http.redirection-limit',
    'network.http.referer.hideOnionSource',
    'network.http.referer.XOriginPolicy',
    'network.http.spdy.enabled',
    'network.http.spdy.enabled.deps',
    'network.http.spdy.enabled.http2',
    'network.http.speculative-parallel-limit',
    'network.IDN_show_punycode',
    'network.predictor.enabled',
    'network.prefetch-next',
    'network.protocol-handler.external.ms-windows-store',
    'network.proxy.socks_remote_dns',
    'offline-apps.allow_by_default',
    'permissions.manager.defaultsUrl',
    'plugin.default.state',
    'plugin.defaultXpi.state',
    'plugin.scan.plid.all',
    'plugin.sessionPermissionNow.intervalInMinutes',
    'security.ask_for_password',
    'security.cert_pinning.enforcement_level',
    'security.csp.experimentalEnabled',
    'security.data_uri.block_toplevel_data_uri_navigations',
    'security.dialog_enable_delay',
    'security.family_safety.mode',
    'security.mixed_content.block_display_content',
    'security.mixed_content.use_hsts',
    'security.OCSP.require',
    'security.pki.sha1_enforcement_level',
    'security.ssl.treat_unsafe_negotiation_as_broken',
    'security.tls.enable_0rtt_data',
    'security.tls.version.max',
    'security.tls.version.min',
    'security.xpconnect.plugin.unrestricted',
    'signon.autofillForms',
    'signon.formlessCapture.enabled',
    'webchannel.allowObject.urlWhitelist',

    /* known culprits */
    'dom.workers.enabled',
    'network.cookie.cookieBehavior',
    'privacy.firstparty.isolate',
    'privacy.resistFingerprinting',

    'last.one.without.comma'
  ]


  if("undefined" === typeof(Services)) {
    alert("about:config needs to be the active tab!");
    return;
  }

  let aBACKUP = [];
  let dummy = 0;
  for (let i = 0, len = ops.length; i < len; i++) {
    if (Services.prefs.prefHasUserValue(ops[i])) {
      dummy = Services.prefs.getPrefType(ops[i]);
      switch (dummy) {
        case 32: // string (see https://dxr.mozilla.org/mozilla-central/source/modules/libpref/nsIPrefBranch.idl#31)
          dummy = Services.prefs.getCharPref(ops[i]);
          aBACKUP.push({'name':ops[i],'value': dummy,'type':32});
          break;
        case 64: // int
          dummy = Services.prefs.getIntPref(ops[i]);
          aBACKUP.push({'name':ops[i],'value': dummy,'type':64});
          break;
        case 128: // boolean
          dummy = Services.prefs.getBoolPref(ops[i]);
          aBACKUP.push({'name':ops[i],'value': dummy,'type':128});
          break;
        default:
          console.log("error detecting pref-type for '"+ops[i]+"' !");
      }
    }
  }
  // console.log(aBACKUP.length, "user-set prefs from our list detected and value stored.");


  myreset(aBACKUP); // resetting all detected prefs

  let myArr = aBACKUP

  focus();
  if (confirm("all detected prefs reset.\n\n!! KEEP THIS PROMPT OPEN AND TEST THE SITE IN ANOTHER TAB !!\n\nIF the problem still exists, this script can't help you - click cancel to re-apply your values and exit.\n\nClick OK if your problem is fixed.")) {
    reapply(aBACKUP);
    myreset(myArr.slice(0, parseInt(myArr.length/2)));
    while (myArr.length >= 2) {
      alert("NOW TEST AGAIN !");
      if (confirm("if the problem still exists click OK, otherwise click cancel.")) {
        myArr = myArr.slice(parseInt(myArr.length/2));
      } else {
        myArr = myArr.slice(0, parseInt(myArr.length/2));
      }
      reapply(aBACKUP);
      myreset(myArr.slice(0, parseInt(myArr.length/2))); // reset half of the remaining prefs
    }
  }

  reapply(aBACKUP); // re-apply all values

  let output = "";
  for (let i = 0, len = myArr.length; i < len; i++) {
    output = output + myArr[i].name + "\n";
  }
  alert("narrowed it down to:\n\n"+output);

  myreset(myArr); // reset the culprit

})();
