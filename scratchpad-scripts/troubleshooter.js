/*** arkenfox user.js troubleshooter.js v1.6.3 ***/

(function() {

  if ("undefined" === typeof(Services)) return alert('about:config needs to be the active tab!');

  const aPREFS = [

    /* known culprits */
    'network.cookie.cookieBehavior',
    'network.http.referer.XOriginPolicy',
    'privacy.firstparty.isolate',
    'privacy.resistFingerprinting',
    'security.mixed_content.block_display_content',
    'svg.disabled',

    /* Storage + Cache */
    'browser.cache.offline.enable',
    'dom.storage.enabled',
    'dom.storageManager.enabled',

    /* Workers, Web + Push Notifications */
    'dom.caches.enabled',
    'dom.push.connection.enabled',
    'dom.push.enabled',
    'dom.push.serverURL',
    'dom.serviceWorkers.enabled',
    'dom.webnotifications.enabled',
    'dom.webnotifications.serviceworker.enabled',

    /* Fonts */
    'browser.display.use_document_fonts',
    'font.blacklist.underline_offset',
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
    'intl.accept_languages',
    'javascript.options.asmjs',
    'javascript.options.wasm',
    'permissions.default.shortcuts',

    /* Hardware */
    'dom.vr.enabled',
    'media.ondevicechange.enabled',

    /* Audio + Video */
    'dom.webaudio.enabled',
    'media.autoplay.default', // FF63+
    'media.autoplay.blocking_policy', // FF78+

    /* Forms */
    'browser.formfill.enable',
    'signon.autofillForms',
    'signon.formlessCapture.enabled',

    /* HTTPS */
    'security.cert_pinning.enforcement_level',
    'security.family_safety.mode',
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
    'plugin.state.flash',

    /* unlikely to cause problems */
    'dom.popup_maximum',
    'geo.provider.network.url',
    'layout.css.visited_links_enabled',
    'mathml.disabled',
    'network.auth.subresource-http-auth-allow',
    'network.http.redirection-limit',
    'network.protocol-handler.external.ms-windows-store',
    'privacy.trackingprotection.enabled',
    'security.data_uri.block_toplevel_data_uri_navigations',
    'privacy.window.name.update.enabled', // FF82+

    'last.one.without.comma'
  ]

  // any runtime-set pref that everyone will have and that can be safely reset
  const oFILLER = { type: 64, name: 'app.update.lastUpdateTime.browser-cleanup-thumbnails', value: 1580000000 };

  function getMyList(arr) {
    const aRet = [];
    for (const sPname of arr) {
      if (Services.prefs.prefHasUserValue(sPname)) {
        const ptype = Services.prefs.getPrefType(sPname);
        switch (ptype) {
          case 32: // string (see https://dxr.mozilla.org/mozilla-central/source/modules/libpref/nsIPrefBranch.idl#31)
            aRet.push({'type':ptype,'name':sPname,'value':Services.prefs.getCharPref(sPname)});
            break;
          case 64: // int
            aRet.push({'type':ptype,'name':sPname,'value':Services.prefs.getIntPref(sPname)});
            break;
          case 128: // boolean
            aRet.push({'type':ptype,'name':sPname,'value':Services.prefs.getBoolPref(sPname)});
            break;
          default:
            console.log("error detecting pref-type for '"+sPname+"' !");
        }
      }
    }
    return aRet;
  }

  function reapply(arr) {
    for (const oPref of arr) {
      switch (oPref.type) {
        case 32: // string
          Services.prefs.setCharPref(oPref.name, oPref.value);
          break;
        case 64: // int
          Services.prefs.setIntPref(oPref.name, oPref.value);
          break;
        case 128: // boolean
          Services.prefs.setBoolPref(oPref.name, oPref.value);
          break;
        default:
          console.log("error re-appyling value for '"+oPref.name+"' !"); // should never happen
      }
    }
  }

  function myreset(arr) {
    for (const oPref of arr) Services.prefs.clearUserPref(oPref.name);
  }

  function resetAllMatchingDefault(arr) {
    const aTmp = getMyList(arr);
    myreset(aTmp);
    reapply(aTmp);
  }

  function _main(aALL) {
    const _h = (arr) => Math.ceil(arr.length/2);

    let aTmp = aALL, aDbg = aALL;
    reapply(aALL);
    myreset(aTmp.slice(0, _h(aTmp)));
    while (aTmp.length) {
      alert('NOW TEST AGAIN !');
      if (confirm('if the problem still exists click OK, otherwise click Cancel.')) {
        aTmp = aTmp.slice(_h(aTmp));
      } else {
        aTmp = aTmp.slice(0, _h(aTmp));
        aDbg = aTmp; // update narrowed down list
        if (aDbg.length == 1) break;
      }
      reapply(aALL);
      myreset(aTmp.slice(0, _h(aTmp))); // reset half of the remaining prefs
    }
    reapply(aALL);

    if (aDbg.length == 1) return alert("narrowed it down to:\n\n"+aDbg[0].name+"\n");
    if (aDbg.length == aALL.length) {
      const msg = "Failed to narrow it down beyond the initial "+aALL.length+" prefs. The problem is most likely caused by at least 2 prefs!\n\n" +
            "Either those prefs are too far apart in the list or there are exactly 2 culprits and they just happen to be at the wrong place.\n\n" +
            "In case it's the latter, the script can add a dummy pref and you can try again - Try again?";
      if (confirm(msg)) return _main([...aALL, oFILLER]);
    } else if (aDbg.length > 10 && confirm("Narrowed it down to "+aDbg.length+" prefs. Try narrowing it down further?")) {
      return _main(aDbg.reverse());
    }

    alert("Narrowed it down to "+ aDbg.length.toString() +" prefs, check the console ...");
    console.log('The problem is caused by 2 or more of these prefs:');
    for (const oPref of aDbg) console.log(oPref.name);
  }


  resetAllMatchingDefault(aPREFS); // reset user-set prefs matching FFs default value

  const aBAK = getMyList(aPREFS);
  //console.log(aBAK.length, "user-set prefs from our list detected and their values stored.");

  const sMsg = "all detected prefs reset.\n\n" +
        "!! KEEP THIS PROMPT OPEN AND TEST THE SITE IN ANOTHER TAB !!\n\n" +
        "IF the problem still exists, this script can't help you - click Cancel to re-apply your values and exit.\n\n" +
        "Click OK if your problem is fixed.";

  focus();
  myreset(aBAK);
  if (!confirm(sMsg)) {
    reapply(aBAK);
    return;
  }
  _main(aBAK);

})();
