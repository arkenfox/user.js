
/*** ghacks-user.js troubleshooter.js v1.5 ***/

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

    /* known culprits */
    'network.cookie.cookieBehavior',
    'network.http.referer.XOriginPolicy',
    'privacy.firstparty.isolate',
    'privacy.resistFingerprinting',
    'security.mixed_content.block_display_content',
    'svg.disabled',

    /* Storage + Cache */
    'browser.cache.offline.enable',
    'dom.indexedDB.enabled',
    'dom.storage.enabled',
    'browser.storageManager.enabled',
    'dom.storageManager.enabled',

    /* Workers, Web + Push Notifications */
    'dom.caches.enabled',
    'dom.push.connection.enabled',
    'dom.push.enabled',
    'dom.push.serverURL',
    'dom.serviceWorkers.enabled',
    'dom.workers.enabled',
    'dom.webnotifications.enabled',
    'dom.webnotifications.serviceworker.enabled',

    /* Fonts */
    'browser.display.use_document_fonts',
    'font.blacklist.underline_offset',
    'gfx.downloadable_fonts.woff2.enabled',
    'gfx.font_rendering.graphite.enabled',
    'gfx.font_rendering.opentype_svg.enabled',
    'layout.css.font-loading-api.enabled',

    /* Misc */
    'browser.link.open_newwindow.restriction',
    'canvas.capturestream.enabled',
    'dom.event.clipboardevents.enabled',
    'dom.event.contextmenu.enabled',
    'dom.IntersectionObserver.enabled',
    'dom.popup_allowed_events',
    'full-screen-api.enabled',
    'geo.wifi.uri',
    'intl.accept_languages',
    'javascript.options.asmjs',
    'javascript.options.wasm',
    'permissions.default.shortcuts',
    'security.csp.experimentalEnabled',

    /* Hardware */
    'dom.vr.enabled',
    'media.ondevicechange.enabled',

    /* Audio + Video */
    'dom.webaudio.enabled',
    'media.autoplay.enabled',

    /* Forms */
    'browser.formfill.enable',
    'signon.autofillForms',
    'signon.formlessCapture.enabled',

    /* HTTPS */
    'security.cert_pinning.enforcement_level',
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

    /* Plugins + Flash */
    'plugin.default.state',
    'plugin.defaultXpi.state',
    'plugin.sessionPermissionNow.intervalInMinutes',
    'plugin.state.flash',

    /* unlikely to cause problems */
    'browser.tabs.remote.allowLinkedWebInFileUriProcess',
    'dom.popup_maximum',
    'layout.css.visited_links_enabled',
    'mathml.disabled',
    'network.auth.subresource-img-cross-origin-http-auth-allow',
    'network.http.redirection-limit',
    'network.protocol-handler.external.ms-windows-store',
    'privacy.trackingprotection.enabled',
    'security.data_uri.block_toplevel_data_uri_navigations',

    'last.one.without.comma'
  ]


  // reset prefs that set the same value as FFs default value
  let aTEMP = getMyList(ops);
  myreset(aTEMP);
  reapply(aTEMP);

  const aBACKUP = getMyList(ops);
  //console.log(aBACKUP.length, "user-set prefs from our list detected and their values stored.");

  let myArr = aBACKUP;
  let found = false;
  let aDbg = [];
  focus();
  myreset(aBACKUP); // reset all detected prefs
  if (confirm("all detected prefs reset.\n\n!! KEEP THIS PROMPT OPEN AND TEST THE SITE IN ANOTHER TAB !!\n\nIF the problem still exists, this script can't help you - click cancel to re-apply your values and exit.\n\nClick OK if your problem is fixed.")) {
    aDbg = myArr;
    reapply(aBACKUP);
    myreset(myArr.slice(0, parseInt(myArr.length/2)));
    while (myArr.length >= 2) {
      alert("NOW TEST AGAIN !");
      if (confirm("if the problem still exists click OK, otherwise click cancel.")) {
        myArr = myArr.slice(parseInt(myArr.length/2));
        if (myArr.length == 1) {
          alert("The problem is caused by more than 1 pref !\n\nNarrowed it down to "+ aDbg.length.toString() +" prefs, check the console ...");
          break;
        }
      } else {
        myArr = myArr.slice(0, parseInt(myArr.length/2));
        aDbg = myArr;
        if (myArr.length == 1) { found = true; break; }
      }
      reapply(aBACKUP);
      myreset(myArr.slice(0, parseInt(myArr.length/2))); // reset half of the remaining prefs
    }
    reapply(aBACKUP);
  }
  else {
    reapply(aBACKUP);
    return;
  }

  if (found) {
    alert("narrowed it down to:\n\n"+myArr[0].name+"\n");
    myreset(myArr); // reset the culprit
  }
  else {
    console.log("the problem is caused by a combination of the following prefs:");
    for (let i = 0, len = aDbg.length; i < len; i++) {
      console.log(aDbg[i].name);
    }
  }

})();
