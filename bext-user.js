// Startup
user_pref("browser.slowStartup.notificationDisabled", true); // Disable startup checks
user_pref("browser.slowStartup.maxSamples", 0);
user_pref("browser.slowStartup.samples", 0);
user_pref("browser.rights.3.shown", true);
user_pref("browser.startup.homepage_override.mstone", "ignore"); // Skip checking of browser's current milestone
user_pref("browser.usedOnWindows10.introURL", "");

// Auto Updates
// user_pref("app.update.enabled", false); // Disable browser auto update
user_pref("app.update.auto", false); // Disable browser installing updates automatically
// user_pref("browser.search.update", false); // Disable search plugins update
// user_pref("extensions.update.enabled", false); // Disable add-ons checking for new versions
user_pref("extensions.update.autoUpdateDefault", false); // Disable add-ons auto update
// user_pref("plugins.update.notifyUser", false); // Disable check for plugin updates
user_pref("lightweightThemes.update.enabled", false); // Disable auto updating of themes
user_pref("extensions.webservice.discoverURL", "http://127.0.0.1"); // Disable extension discovery
/* Featured extensions for displaying in "Get Add-ons" panel */

// Privacy
user_pref("geo.enabled", false); // Disable location-aware browsing
user_pref("geo.wifi.uri", "http://127.0.0.1");
user_pref("browser.search.geoip.url", "");
user_pref("browser.search.countryCode", "US"); // Disable GeoIP-based search results
user_pref("browser.search.region", "US");
user_pref("toolkit.telemetry.unified", false); // Disable telemetry
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.server", "");
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("toolkit.telemetry.cachedClientID", "");
user_pref("toolkit.telemetry.unifiedIsOptIn", true);
user_pref("toolkit.telemetry.optoutSample", false);
user_pref("browser.selfsupport.url", ""); // Disable heartbeat
/* Mozilla user rating telemetry */
user_pref("datareporting.policy.dataSubmissionEnabled", false); // Disable health report
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.healthreport.documentServerURI", "");
user_pref("datareporting.healthreport.service.enabled", false);
/* https://gecko.readthedocs.org/en/latest/toolkit/components/telemetry/telemetry/preferences.html
https://bugzilla.mozilla.org/show_bug.cgi?id=1195552 */
user_pref("datareporting.policy.dataSubmissionEnabled.v2", false);
user_pref("experiments.enabled", false); // Disable experiments
user_pref("experiments.manifest.uri", "");
user_pref("experiments.supported", false);
user_pref("experiments.activeExperiment", false);
user_pref("network.allow-experiments", false);
/* Disable permission to silently opt you into tests */
user_pref("breakpad.reportURL", ""); // Disable crash reports
user_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled", false); // Disable plugin crash reports
user_pref("extensions.getAddons.cache.enabled", false); // Disable add-on usage reporting
user_pref("dom.ipc.plugins.reportCrashURL", false); // Disable reporting the URL where a plugin crashed
user_pref("browser.aboutHomeSnippets.updateUrl", "https://127.0.0.1"); // Disable Snippet Service
/* https://wiki.mozilla.org/Firefox/Projects/Firefox_Start/Snippet_Service */
user_pref("loop.enabled", false); // Disable hello
/* A WebRTC mozilla voice & video call that doesn't require an account - IP leak */
user_pref("browser.pocket.enabled", false); // Disable Pocket
user_pref("browser.pocket.api", "");
user_pref("browser.pocket.site", "");
user_pref("reader.parse-on-load.enabled", false); // Disable built-in Reader
user_pref("social.whitelist", ""); // Disable social features
/* https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Social_API */
user_pref("social.toast-notifications.enabled", false);
user_pref("social.shareDirectory", "");
user_pref("social.remote-install.enabled", false);
user_pref("social.directories", "");
user_pref("social.share.activationPanelEnabled", false);
user_pref("extensions.blocklist.enabled", true); // Disable block reported web forgeries / URL check
/* https://blog.mozilla.org/security/2015/03/03/revoking-intermediate-certificates-introducing-onecrl/
 https://support.mozilla.org/en-US/kb/tracking-protection-firefox */
user_pref("browser.safebrowsing.enabled", false); // Disable safebrowsing URLs checks
user_pref("browser.safebrowsing.malware.enabled", false);
/* Disable contatcing Google for malware check */
user_pref("browser.safebrowsing.downloads.enabled", false);
user_pref("browser.safebrowsing.downloads.remote.enabled", false);
user_pref("browser.safebrowsing.appRepURL", "");
user_pref("browser.safebrowsing.gethashURL", "");
user_pref("browser.safebrowsing.malware.reportURL", "");
user_pref("browser.safebrowsing.reportErrorURL", "");
user_pref("browser.safebrowsing.reportGenericURL", "");
user_pref("browser.safebrowsing.reportMalwareErrorURL", "");
user_pref("browser.safebrowsing.reportMalwareURL", "");
user_pref("browser.safebrowsing.reportPhishURL", "");
user_pref("browser.safebrowsing.reportURL", "");
user_pref("browser.safebrowsing.updateURL", "");
user_pref("browser.polaris.enabled", false);
user_pref("privacy.trackingprotection.enabled", false); // Disable tracking protection
user_pref("browser.trackingprotection.gethashURL", "");
user_pref("browser.trackingprotection.getupdateURL", "");
user_pref("privacy.trackingprotection.pbmode.enabled", false);
user_pref("network.prefetch-next", false); // Disable background prefetching
user_pref("security.ssl.errorReporting.automatic", false); // Bext
user_pref("security.ssl.errorReporting.enabled", false); // Bext
user_pref("security.ssl.errorReporting.url", ""); // Bext
/* Disable link prefetching */
user_pref("network.dns.disablePrefetch", true);
user_pref("network.dns.disablePrefetchFromHTTPS", true);
user_pref("network.predictor.enabled", false);
/* Disable seer/necko */
// user_pref("browser.search.suggest.enabled", true);
/* Disable search suggestions */
user_pref("network.http.speculative-parallel-limit", 0);
user_pref("browser.send_pings", false);
/* Disable pings */
user_pref("browser.send_pings.require_same_host", true);
/* Disable pings */

// SSL, OCSP, Certs, Encryption, HTTP
user_pref("privacy.donottrackheader.enabled", true); // Set "Do Not Track" HTTP header
user_pref("privacy.donottrackheader.value", 1); //bext//
//bext// AliExpress login does not work ////user_pref("network.http.sendSecureXSiteReferrer", false); // Disable Referer from an SSL Website
user_pref("security.tls.unrestricted_rc4_fallback", false); // Block rc4 fallback and disable whitelist
user_pref("security.tls.insecure_fallback_hosts.use_static_list", false);
user_pref("security.ssl3.ecdhe_ecdsa_rc4_128_sha", false); // Override rc4 ciphers (deprecated)
user_pref("security.ssl3.ecdhe_rsa_rc4_128_sha", false);
user_pref("security.ssl3.rsa_rc4_128_md5", false);
user_pref("security.ssl3.rsa_rc4_128_sha", false);
user_pref("security.ssl3.dhe_rsa_aes_128_sha", false); // Bext
user_pref("security.ssl3.dhe_rsa_aes_256_sha", false); // Bext
user_pref("security.ssl.enable_ocsp_stapling", true); // Enable OCSP Stapling
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true); // Display warning (red padlock) for "broken security"
// user_pref("security.OCSP.require", true); // Require certificate revocation check through OCSP protocol
/* This leaks information about the sites you visit to the CA.
When set to true, a number of people have experienced issues with youtube, if this is you, change it to false It's a trade-off between security (checking) and privacy (leaking info to the CA) */
user_pref("security.OCSP.enabled", 1); // Enable OCSP
/* Query OCSP responder servers to confirm current validity of certificates
0=disable, 1=validate only certificates that specify an OCSP service URL, 2=enable and use values in security.OCSP.URL and security.OCSP.signingCA for validation */
user_pref("security.cert_pinning.enforcement_level", 2); // Enforce strict pinning
/* https://trac.torproject.org/projects/tor/ticket/16206 */

// Plugins
user_pref("plugin.default.state", 1); // Set default plugin state to ask to activate
/* 0:disabled, 1:ask to activate, 2:active - you can override individual plugins */
user_pref("plugins.click_to_play", true); // Enable click to play and set to 0 minutes
user_pref("plugin.defaultXpi.state", 0);
user_pref("plugin.sessionPermissionNow.intervalInMinutes", 0);
user_pref("pfs.datasource.url", ""); // Remove plugin finder service
user_pref("plugins.enumerable_names", ""); // Disable plugin enumeration
user_pref("security.xpconnect.plugin.unrestricted", false);
user_pref("plugin.scan.plid.all", false); // Disable scanning for plugins
/* This defines if Firefox will scan the Windows Registry for plugin links (if set to true) or not (set to false). */
user_pref("plugin.scan.Acrobat", 99999);
/* http://kb.mozillazine.org/Plugin_scanning */
user_pref("plugin.scan.Quicktime", 99999);
user_pref("plugin.scan.WindowsMediaPlayer", 99999);
user_pref("media.autoplay.enabled", true); // Disable auto-play of HTML5 media

// Media, Camera, Mic
user_pref("media.peerconnection.enabled", false); // Disable WebRTC
user_pref("media.peerconnection.use_document_iceservers", false);
user_pref("media.peerconnection.video.enabled", false);
user_pref("media.peerconnection.identity.timeout", 1);
user_pref("media.gmp-gmpopenh264.enabled", false);
user_pref("media.gmp-manager.url", "");
user_pref("browser.eme.ui.enabled", false); // Disable EME bits
/* https://trac.torproject.org/projects/tor/ticket/16285 */
user_pref("media.gmp-eme-adobe.enabled", false);
user_pref("media.eme.enabled", false);
user_pref("media.eme.apiVisible", false);
user_pref("media.navigator.enabled", false); // Disable getUserMedia
/* https://wiki.mozilla.org/Media/getUserMedia */
user_pref("media.video_stats.enabled", false); // Disable video statistics fingerprinting vector
/* JavaScript performace fingerprinting */
user_pref("media.webspeech.recognition.enable", false); // Disable speech recognition
user_pref("media.getusermedia.screensharing.enabled", false); // Disable screen sharing
user_pref("media.getusermedia.screensharing.allowed_domains", "");
user_pref("camera.control.autofocus_moving_callback.enabled", false); // Disable camera
user_pref("camera.control.face_detection.enabled", false);

// JavaScript & DOM
user_pref("dom.event.contextmenu.enabled", true); // Disable JavaScript meddling
/* Disable website control over right click context menu
see http://kb.mozillazine.org/Prevent_websites_from_disabling_new_window_features */
user_pref("dom.disable_window_open_feature.location", true); // Disable Scripts capabilities
user_pref("dom.disable_window_open_feature.menubar", true);
user_pref("dom.disable_window_open_feature.resizable", true);
user_pref("dom.disable_window_open_feature.scrollbars", true);
user_pref("dom.disable_window_open_feature.status", true);
user_pref("dom.disable_window_open_feature.toolbar", true);
user_pref("dom.disable_window_flip", true);
/* window z-order */
user_pref("dom.disable_window_move_resize", true);
user_pref("dom.disable_window_open_feature.close", true);
user_pref("dom.disable_window_open_feature.minimizable", true);
user_pref("dom.disable_window_open_feature.personalbar", true);
/* bookmarks toolbar */
user_pref("dom.disable_window_open_feature.titlebar", true);
user_pref("dom.disable_window_status_change", true);
user_pref("dom.allow_scripts_to_close_windows", false);
user_pref("dom.storage.enabled", true); // Disable DOM storage
user_pref("dom.telephony.enabled", false); // Disable Web Telephony
/* https://wiki.mozilla.org/WebAPI/Security/WebTelephony */
user_pref("dom.gamepad.enabled", false); // Disable gamepad API
user_pref("dom.battery.enabled", false); // Disable battery API
user_pref("dom.network.enabled", false); // Disable network API
user_pref("dom.netinfo.enabled", false); // Disable giving away network info
/* https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API */
user_pref("dom.enable_user_timing", false); // Disable User Timing API
/* https://trac.torproject.org/projects/tor/ticket/16336 */
user_pref("dom.enable_resource_timing", false); // Disable resource/navigation timing
/* https://wiki.mozilla.org/Security/Reviews/Firefox/NavigationTimingAPI */
user_pref("dom.enable_performance", false); // Disable javascript performace fingerprinting
user_pref("dom.vr.enabled", false); // Disable virtual reality devices
user_pref("dom.vr.oculus.enabled", false);
user_pref("dom.vr.oculus050.enabled", false);
user_pref("dom.vibrator.enabled", false); // Disable shaking the screen
user_pref("dom.popup_maximum", 3); // Max popups from a single non-click event
/* default is 20! */
user_pref("dom.idle-observers-api.enabled", false); // Disable idle observation
user_pref("dom.workers.sharedWorkers.enabled", false); // Disable SharedWorkers
/* https://www.torproject.org/projects/torbrowser/design/#identifier-linkability  (see no. 8) */

// Leaks, fingerprinting, security, dev tools
user_pref("beacon.enabled", false); // Disable sending additional analytics to web servers
/* https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon
enforces user interaction for security reasons https://bugzil.la/238789#c19 */
user_pref("browser.helperApps.deleteTempFileOnExit", true); // Don't integrate activity into Windows' recent documents
user_pref("browser.download.manager.addToRecentDocs", false);
user_pref("browser.download.hide_plugins_without_extensions", false); // Show all mime types
/* Disable hiding mime types in prefs applications tab that are not associated with a plugin. */
user_pref("browser.pagethumbnails.capturing_disabled", true); // Disable Page thumbnails
user_pref("network.jar.open-unsafe-types", false); // Disable JAR from opening Unsafe File Types
user_pref("security.mixed_content.block_active_content", true); // Disable insecure active content on https pages (mixed content)
user_pref("devtools.webide.autoinstallADBHelper", false); // Disable WebIDE to prevent remote debugging and addon downloads
/* https://trac.torproject.org/projects/tor/ticket/16222 */
user_pref("devtools.webide.autoinstallFxdtAdapters", false);
user_pref("devtools.debugger.remote-enabled", false);
user_pref("devtools.webide.enabled", false);
user_pref("browser.casting.enabled", false); // Disable SimpleServiceDiscovery
/* can bypass proxy settings - eg Roku
https://trac.torproject.org/projects/tor/ticket/16222 */
user_pref("gfx.layerscope.enabled", false);
user_pref("device.sensors.enabled", false); // Disable device sensor API - fingerprinting vector
user_pref("network.http.spdy.enabled", false); // Disable SPDY
/* SPDY can contain identifiers
https://www.torproject.org/projects/torbrowser/design/#identifier-linkability  (see no. 10) */
user_pref("network.http.spdy.enabled.v3-1", false);
user_pref("network.http.spdy.enabled.http2", false);
user_pref("network.http.spdy.enabled.http2draft", false);
user_pref("signon.autofillForms", false); // Disable auto-filling form fields
/* can leak in cross-site forms
http://kb.mozillazine.org/Signon.autofillForms
password will still be set after the user name is manually entered */
user_pref("network.proxy.socks_remote_dns", true); // Enforce DNS lookup when using SOCKS
/* When using SOCKS have the proxy server do the DNS lookup - DNS leak issue.
http://kb.mozillazine.org/Network.proxy.socks_remote_dns
https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO/WebBrowsers
eg in TOR, this stops your local DNS server from knowing your Tor destination as a remote Tor node will handle the DNS request */

// Location bar, search, auto suggestions, history
// user_pref("keyword.URL", "https://duckduckgo.com/?q="); // Change default search engine for the location bar
/* Google: https://encrypted.google.com/search?hl=en&q=
Yandex: https://www.yandex.com/search/?lr=87&text=
When entering information in the Location Bar, Mozilla attempts to convert the information into a usable URL. For example,  mozilla.org is automatically converted to http://mozilla.org/. When Mozilla is unable to discern what URL the user wanted, the information that was entered may be submitted to an Internet Keywords service. This preference determines the Internet Keywords service URL. */
// user_pref("keyword.enabled", true); // Disable directly searching from location bar
user_pref("browser.fixup.alternate.enabled", false); // Disable location bar domain guessing
user_pref("browser.urlbar.maxRichResults", 9); // Disable location bar dropdown
// user_pref("browser.urlbar.trimURLs", false); // Display full url with protocol
// user_pref("browser.urlbar.autoFill", false); // Disable URL bar autofill
// user_pref("browser.urlbar.autoFill.typed", false);
// user_pref("browser.urlbar.autocomplete.enabled", false); // Disable autocomplete
user_pref("browser.urlbar.filter.javascript", true); // Disable displaying JavaScript in history URLs
user_pref("layout.css.visited_links_enabled", false); // Disable CSS querying page history
// user_pref("browser.history.allowPopState", false); // Disable history manipulation
// user_pref("browser.history.allowPushState", false);
// user_pref("browser.history.allowReplaceState", false);
// user_pref("browser.urlbar.unifiedcomplete", false); // Disable "Search with" in url bar
/* https://wiki.mozilla.org/QA/Places/Unified_autocomplete */

// Cache
user_pref("browser.cache.disk.enable", false); // Disable disk cache
user_pref("browser.cache.disk_cache_ssl", false);
user_pref("browser.cache.offline.enable", false); // Disable offline cache
user_pref("browser.sessionstore.privacy_level", 2); // Disable storing extra session data
/* 0:all 1:http-only 2:none */
user_pref("browser.sessionstore.privacy_level_deferred", 2);

// Tabs
user_pref("browser.newtab.preload", false); // Disable new tab preloading, ads
user_pref("browser.newtabpage.directory.ping", "");
user_pref("browser.newtabpage.directory.source", "");
user_pref("browser.newtabpage.enabled", false);
user_pref("browser.newtabpage.enhanced", false);
user_pref("browser.newtabpage.introShown", true);
user_pref("browser.tabs.closeWindowWithLastTab", false); // Disable closing browser with last tab
user_pref("browser.sessionhistory.max_entries", 10); // Limit history per tab
/* (back/forward) - history leaks via enumeration default: 50 */
user_pref("browser.sessionstore.max_tabs_undo", 10); // Limit history for "Undo Close Tab"
/* By default Firefox holds a history of up to 10 last closed tabs. Here you can change the value to increase or decrease. */
user_pref("browser.ctrlTab.previews", true); // Enable Ctrl+Tab thumbnails to switch between tabs (MRU behavior)
/* [Boolean] - Disabled by default, if enabled (set to True) then you can use the enhanced CTRL+TAB switching capabilities of Firefox when three or more tabs are open.
Enabling it will make possible to switch between MRU (most recently used) tabs behavior. */

// Tweaks
user_pref("browser.tabs.warnOnClose", false); // Disable warning on closing multiple tabs
user_pref("browser.tabs.warnOnCloseOtherTabs", false);
user_pref("browser.tabs.warnOnOpen", false);
user_pref("browser.download.manager.quitBehavior", 2); // Confirm quit if download is in progress
/* This option is useful in cases where download sources does not allow resuming downloads.
0:Active downloads will be paused and auto-resumed the next time the browser starts (Default)
1:Active downloads will be paused
2:Active downloads will be cancelled (user will be asked to confirm before quit) */
// user_pref("browser.search.showOneOffButtons", false); // Restore search panel to old style (icons + labels)
/* If false, search panel will show icons and label (old style) */
user_pref("browser.bookmarks.max_backups", 0); // Limit bookmarks backups to keep
/* Default is 10.
Setting to 0 will disable backups.
-1 will keep an unlimited number of backups. */
// user_pref("browser.chrome.site_icons", false); // Disable website icons
/* Will reduce the bookmarks file size considerably */
// user_pref("browser.chrome.favicons", false);
/* True: Display favicons in the address bar, bookmarks menu, and in tabs. (Default)
False: Display the default Mozilla document icon instead.
If true, browser.chrome.site_icons must also be true for this preference to have an effect. */
// user_pref("mousewheel.default.delta_multiplier_y", 300); // Increase mouse wheel (scroll) sensibility
/* Default is 100.
300 will make the scrolling more responsive.
https://support.mozilla.org/en-US/questions/1019147 */
// user_pref("general.useragent.override", "Mozilla/5.0 (X11; Linux i686 on x86_64; rv:10.0) Gecko/20100101 Firefox/40.0"); // Use a custom UserAgent String
/* http://www.useragentstring.com/pages/useragentstring.php
http://www.useragentstring.com/pages/Firefox/ */
// user_pref("image.animation_mode", "none"); // Disable gif animations
/* normal (default): will allow it to play over and over
none: will prevent image animation 
once: will let the image animate once */
user_pref("full-screen-api.approval-required", false); // Disable fullscreen warning message
/* Disable message when going fullscreen: "[...] is now in fullscreen. Press ESC at any time to exit." */
user_pref("full-screen-api.warning.timeout", 0);
// user_pref("browser.zoom.siteSpecific", ""); // Same zoom level for every site
/* Firefox remembers your zoom preference for each site and set it to your preferences whenever you load the page. Setting browser.zoom.siteSpecific to false will make all sites have the same zoom level. */
// user_pref("browser.chrome.toolbar_tips", false); // Disable tooltips
// user_pref("browser.link.open_newwindow", 3); // Force links to open in the same tab
/* Value of 1: Opens links that would normally open in a new tab or new window in the current tab or window
Value of 2: Open links that would normally open in a new window, in a new window
Value of 3: Open links that would normally open in a new window in a new tab in the current window (default) */

// Plugins & Addons
user_pref("browser.addon-watch.interval", "-1"); // Disable checking of addons performance
user_pref("browser.addon-watch.percentage-limit", "-1");
user_pref("browser.addon-watch.deactivate-after-idle-ms", "-1");

// Cache & Session
// user_pref("browser.sessionstore.enabled", false); // Disable sessions
user_pref("browser.sessionstore.interval", 60000); // Adjust the session restore saving frequency
/* Controls how often Firefox will save the current session to disk.
Value is in ms. Default is 15000 (15 seconds) */

// Bext - Security
user_pref("security.ssl.require_safe_negotiation", false); // security.ssl.require_safe_negotiation
user_pref("webgl.disabled", true); // webgl.disabled
user_pref("webgl.min_capability_mode", true); // Bext
user_pref("webgl.disable-extensions", true); // Bext
user_pref("pdfjs.enableWebGL", false); // Bext
user_pref("browser.cache.memory.enable", false); // browser.cache.memory.enable
user_pref("pdfjs.disabled", true); // pdfjs.disabled
user_pref("network.http.use-cache", false); // network.http.use-cache

// Bext - Privacy
// user_pref("dom.event.clipboardevents.enabled", false); // dom.event.clipboardevents.enabled
user_pref("places.history.enabled", false); // places.history.enabled
user_pref("privacy.sanitize.sanitizeOnShutdown", true); // privacy.sanitize.sanitizeOnShutdown
user_pref("privacy.clearOnShutdown.cache", true); // privacy.clearOnShutdown.cache
user_pref("privacy.clearOnShutdown.cookies", false); // privacy.clearOnShutdown.cookies
user_pref("privacy.clearOnShutdown.downloads", true); // privacy.clearOnShutdown.downloads
user_pref("privacy.clearOnShutdown.formdata", false); // privacy.clearOnShutdown.formdata
user_pref("privacy.clearOnShutdown.history", true); // privacy.clearOnShutdown.history 
user_pref("privacy.clearOnShutdown.offlineApps", true); // privacy.clearOnShutdown.offlineApps
user_pref("privacy.clearOnShutdown.passwords", false); // privacy.clearOnShutdown.passwords
user_pref("privacy.clearOnShutdown.sessions", false); // privacy.clearOnShutdown.sessions
user_pref("privacy.clearOnShutdown.siteSettings", false); // privacy.clearOnShutdown.siteSettings
user_pref("privacy.cpd.cache", true); // privacy.cpd.cache
user_pref("privacy.cpd.cookies", false); // privacy.cpd.cookies
user_pref("privacy.cpd.downloads", true); // privacy.cpd.downloads
user_pref("privacy.cpd.formdata", false); // privacy.cpd.formdata
user_pref("privacy.cpd.history", true); // privacy.cpd.history
user_pref("privacy.cpd.offlineApps", true); // privacy.cpd.offlineApps
user_pref("privacy.cpd.passwords", false); // privacy.cpd.passwords
user_pref("privacy.cpd.sessions", false); // privacy.cpd.sessions
user_pref("privacy.cpd.siteSettings", false); // privacy.cpd.siteSettings

// Bext - Enterprise specifics + Comtrade
//user_pref("network.automatic-ntlm-auth.allow-non-fqdn", true); // network.automatic-ntlm-auth.allow-non-fqdn
//user_pref("plugins.load_appdir_plugins", true); // plugins.load_appdir_plugins == TRUE for Skype4Business/Lync to be able to open meeting URLs
//user_pref("network.automatic-ntlm-auth.trusted-uris", "comtrade.com"); //,hermes-softlab.com,hermes.si"); // network.automatic-ntlm-auth.trusted-uris
user_pref("security.enterprise_roots.enabled", true);

// Bext - Extension - CanvasBlocker
user_pref("extensions.CanvasBlocker@kkapsner.de.askOnlyOnce", false); // extensions.CanvasBlocker@kkapsner.de.askOnlyOnce
user_pref("extensions.CanvasBlocker@kkapsner.de.blockMode", "fakeReadout"); // extensions.CanvasBlocker@kkapsner.de.blockMode
user_pref("extensions.CanvasBlocker@kkapsner.de.rng", "persistent"); // extensions.CanvasBlocker@kkapsner.de.blockMode
// user_pref("extensions.CanvasBlocker@kkapsner.de.showNotifications", false); // extensions.CanvasBlocker@kkapsner.de.showNotifications
// user_pref("extensions.CanvasBlocker@kkapsner.de.whiteList", ""); // extensions.CanvasBlocker@kkapsner.de.whiteList

// Bext - Extension - FindBar Tweaks
user_pref("extensions.findbartweak.showTabOnUpdates", false);
user_pref("extensions.findbartweak.userNoticedTabOnUpdates", false);

// Bext - Extension - NoScript
//user_pref("noscript.doNotTrack.enabled", false); // noscript.doNotTrack.enabled
user_pref("noscript.global", true); // noscript.global
/* Allow Scripts, but still protects for XSS, ABE and other crap */

// Bext - Extension - Safe Login
user_pref("extensions.secureLogin@blueimp.net.welcome", false); // extensions.secureLogin@blueimp.net.welcome
user_pref("extensions.secureLogin@blueimp.net.searchLoginsOnload", true); // extensions.secureLogin@blueimp.net.searchLoginsOnload
user_pref("extensions.secureLogin@blueimp.net.plength", 16); // extensions.secureLogin@blueimp.net.plength
user_pref("extensions.secureLogin@blueimp.net.pcharset", "ABCDEFGHJKLMNPQRSTUVWXabcdefghijkmnopqrstuvwx123456789"); // extensions.secureLogin@blueimp.net.pcharset

// Bext - Extension - Self-Destructing Cookies
user_pref("extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.clearCache", 120);
user_pref("extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.gracePeriod", 6);
ser_pref("extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.displayNotification",false);
user_pref("extensions.jid0-9XfBwUWnvPx4wWsfBWMCm4Jj69E@jetpack.keepIFrames",true);

// Bext - Extension - RefControl
user_pref("refcontrol.actions", "@DEFAULT=@FORGE");

// Bext - Annoyances
user_pref("general.warnOnAboutConfig", false); // general.warnOnAboutConfig 
user_pref("browser.sessionstore.restore_on_demand", false); // browser.sessionstore.restore_on_demand 
user_pref("browser.tabs.insertRelatedAfterCurrent", true); // browser.tabs.insertRelatedAfterCurrent
user_pref("media.mediasource.webm.enabled", true); // media.mediasource.webm.enabled
user_pref("media.block-play-until-visible", true); // media.block-play-until-visible

// Bext - Custom
user_pref("browser.startup.homepage", "https://start.duckduckgo.com/"); // browser.startup.homepage
user_pref("browser.shell.checkDefaultBrowser", false); // browser.shell.checkDefaultBrowser
user_pref("browser.customizemode.tip0.shown", true); // browser.customizemode.tip0.shown
user_pref("browser.urlbar.suggest.searches", true); // browser.urlbar.suggest.searches
user_pref("browser.search.suggest.enabled", true); // browser.search.suggest.enabled
user_pref("network.cookie.cookieBehavior", 0); // network.cookie.cookieBehavior
/* 0 = Accept 3rd party cookies, 1 = Block 3rd party cookies, 2 = Block all cookies */
user_pref("network.cookie.thirdparty.sessionOnly", true); // network.cookie.thirdparty.sessionOnly
/* True to restrict 3rd party cookies to current session only */
user_pref("accessibility.typeaheadfind", true); // accessibility.typeaheadfind

// Bext - Experimental
user_pref("media.block-autoplay-until-in-foreground", true) //already covered with "Autoplay No More", ANM also blocks next media
// dom.ipc.plugins.sandbox-level.flash
// dom.ipc.plugins.sandbox-level.default
// dom.ipc.plugins.flash.disable-protected-mode
// privacy.firstparty.isolate
