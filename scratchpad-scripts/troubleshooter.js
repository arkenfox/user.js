
/*** ghacks-user.js troubleshooter.js v1.2 ***/

(function() {

  if("undefined" === typeof(Services)) {
    alert("about:config needs to be the active tab!");
    return;
  }

  function getMyList(arr) {
    let aRet = [];
    let dummy = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
      if (Services.prefs.prefHasUserValue(arr[i])) {
        dummy = Services.prefs.getPrefType(arr[i]);
        switch (dummy) {
          case 32: // string (see https://dxr.mozilla.org/mozilla-central/source/modules/libpref/nsIPrefBranch.idl#31)
            dummy = Services.prefs.getCharPref(arr[i]);
            aRet.push({'name':arr[i],'value': dummy,'type':32});
            break;
          case 64: // int
            dummy = Services.prefs.getIntPref(arr[i]);
            aRet.push({'name':arr[i],'value': dummy,'type':64});
            break;
          case 128: // boolean
            dummy = Services.prefs.getBoolPref(arr[i]);
            aRet.push({'name':arr[i],'value': dummy,'type':128});
            break;
          default:
            console.log("error detecting pref-type for '"+arr[i]+"' !");
        }
      }
    }
    return aRet;
  }

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
    'browser.cache.offline.enable',
    'browser.display.use_document_fonts',
    'browser.formfill.enable',
    'browser.link.open_newwindow.restriction',
    'browser.search.suggest.enabled',
    'browser.storageManager.enabled',
    'browser.tabs.remote.allowLinkedWebInFileUriProcess',
    'browser.urlbar.autoFill',
    'browser.urlbar.autoFill.typed',
    'browser.urlbar.oneOffSearches',
    'browser.urlbar.suggest.searches',
    'camera.control.face_detection.enabled',
    'canvas.capturestream.enabled',
    'dom.caches.enabled',
    'dom.event.clipboardevents.enabled',
    'dom.event.contextmenu.enabled',
    'dom.idle-observers-api.enabled',
    'dom.IntersectionObserver.enabled',
    'dom.popup_allowed_events',
    'dom.popup_maximum',
    'dom.push.connection.enabled',
    'dom.push.enabled',
    'dom.push.serverURL',
    'dom.serviceWorkers.enabled',
    'dom.storage.enabled',
    'dom.storageManager.enabled',
    'dom.vr.enabled',
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
    'media.flac.enabled',
    'media.mp4.enabled',
    'media.ogg.enabled',
    'media.ondevicechange.enabled',
    'media.opus.enabled',
    'media.raw.enabled',
    'media.wave.enabled',
    'media.webm.enabled',
    'media.wmf.enabled',
    'network.auth.subresource-img-cross-origin-http-auth-allow',
    'network.cookie.thirdparty.sessionOnly',
    'network.http.redirection-limit',
    'network.http.referer.XOriginPolicy',
    'network.protocol-handler.external.ms-windows-store',
    'plugin.default.state',
    'plugin.defaultXpi.state',
    'plugin.sessionPermissionNow.intervalInMinutes',
    'plugin.state.flash',
    'privacy.trackingprotection.enabled',
    'security.cert_pinning.enforcement_level',
    'security.csp.experimentalEnabled',
    'security.data_uri.block_toplevel_data_uri_navigations',
    'security.family_safety.mode',
    'security.mixed_content.use_hsts',
    'security.OCSP.require',
    'security.pki.sha1_enforcement_level',
    'security.ssl.require_safe_negotiation',
    'security.ssl.treat_unsafe_negotiation_as_broken',
    'security.ssl3.dhe_rsa_aes_128_sha',
    'security.ssl3.dhe_rsa_aes_256_sha',
    'security.ssl3.ecdhe_ecdsa_aes_128_sha',
    'security.ssl3.ecdhe_rsa_aes_128_sha',
    'security.ssl3.rsa_aes_128_sha',
    'security.ssl3.rsa_aes_256_sha',
    'security.ssl3.rsa_des_ede3_sha',
    'security.tls.enable_0rtt_data',
    'security.tls.version.max',
    'security.tls.version.min',
    'security.xpconnect.plugin.unrestricted',
    'signon.autofillForms',
    'signon.formlessCapture.enabled',

    /* known culprits */
    'dom.indexedDB.enabled',
    'dom.workers.enabled',
    'network.cookie.cookieBehavior',
    'privacy.firstparty.isolate',
    'privacy.resistFingerprinting',
    'security.mixed_content.block_display_content',
    'svg.disabled',

    'last.one.without.comma'
  ]


  // reset prefs that set the same value as FFs default value
  let aTEMP = getMyList(ops);
  myreset(aTEMP);
  reapply(aTEMP);

  const aBACKUP = getMyList(ops);
  //console.log(aBACKUP.length, "user-set prefs from our list detected and their values stored.");

  myreset(aBACKUP); // resetting all detected prefs

  let myArr = aBACKUP;
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
    reapply(aBACKUP);
  } else {
    reapply(aBACKUP);
    return;
  }

  if (myArr.length == 1) {
    alert("narrowed it down to:\n\n"+myArr[0].name+"\n");
    myreset(myArr); // reset the culprit
  }

})();
