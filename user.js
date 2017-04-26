/******
* name: ghacks user.js
* date: 15 April 2017
* version 53-beta: Achy Breaky Pants
*   "But don't tell my pants, my achy breaky pants, I just don't think they'd understand"
* authors: v52+ github | v51- www.ghacks.net
* url: https://github.com/ghacksuserjs/ghacks-user.js

* releases: These are end-of-stable-life-cycle legacy archives.
            *Always* use the master branch user.js for a current up-to-date version.
       url: https://github.com/ghacksuserjs/ghacks-user.js/releases

* README:

  1. READ the full README at github
  2. READ the full README at github
  3. If you skipped steps 1 and 2 above (shame on you), then here is the absolute minimum
     * The settings below will turn off Tracking Protection, Safe Browsing and Auto Updates
       You need to read, understand, and decide about these. Don't leave yourself less secure
     * Some user data is erased (section 2800), namely history (browsing, form, download)
     * Site breakage WILL happen
         - There are often trade-offs and conflicts between Security vs Privacy vs Anti-Fingerprinting
           and these need to be balanced against Functionality & Convenience & Breakage
     * You will need to make a few changes to suit your own needs
         - Search this file for the "[SETUP]" tag to find SOME common items you could check
           before using to avoid unexpected surprises
         - Search this file for the "[WARNING]" tag to troubleshoot or prevent SOME common issues

  4. BACKUP BACKUP BACKUP your profile folder before implementing (and/or test in a new profile)
  5. Did you do a BACKUP?

 ******/

/* START: internal custom pref to test for syntax errors (thanks earthling)
 * Yes, this next pref setting is redundant, but we like it!
 * [1] https://en.wikipedia.org/wiki/Dead_parrot
 * [2] https://en.wikipedia.org/wiki/Warrant_canary ***/
user_pref("ghacks_user.js.parrot", "Oh yes, the Norwegian Blue... what's wrong with it?");

/* 0001: Start Firefox in PB (Private Browsing) mode
 * [SETTING] Options>Privacy>History>Custom Settings>Always use private browsing mode
 * [NOTE] In this mode *all* windows are "private windows" and the PB mode icon is not displayed
 * [1] https://wiki.mozilla.org/Private_Browsing ***/
   // user_pref("browser.privatebrowsing.autostart", true);

/*** 0100: STARTUP ***/
user_pref("ghacks_user.js.parrot", "0100 syntax error: the parrot's dead!");
/* 0101: disable "slow startup" options
 * warnings, disk history, welcomes, intros, EULA, default browser check ***/
user_pref("browser.slowStartup.notificationDisabled", true);
user_pref("browser.slowStartup.maxSamples", 0);
user_pref("browser.slowStartup.samples", 0);
user_pref("browser.rights.3.shown", true);
user_pref("browser.startup.homepage_override.mstone", "ignore");
user_pref("startup.homepage_welcome_url", "");
user_pref("startup.homepage_welcome_url.additional", "");
user_pref("startup.homepage_override_url", ""); // what's new page after updates
user_pref("browser.laterrun.enabled", false);
user_pref("browser.shell.checkDefaultBrowser", false);
/* 0102: set start page (0=blank, 1=home, 2=last visited page, 3=resume previous session)
 * home = browser.startup.homepage preference.
 * [SETTING] Options>General>Startup>When Firefox starts ***/
   // user_pref("browser.startup.page", 0);

/*** 0200: GEOLOCATION ***/
user_pref("ghacks_user.js.parrot", "0200 syntax error: the parrot's definitely deceased!");
/* 0201: disable location-aware browsing ***/
user_pref("geo.enabled", false);
user_pref("geo.wifi.uri", "https://127.0.0.1");
user_pref("geo.wifi.logging.enabled", false); // (hidden pref)
user_pref("browser.search.geoip.url", "");
user_pref("geo.wifi.xhr.timeout", 1);
user_pref("browser.search.geoip.timeout", 1);
/* 0202: disable GeoIP-based search results
 * [NOTE] may not be hidden if Firefox has changed your settings due to your locale
 * [1] https://trac.torproject.org/projects/tor/ticket/16254 ***/
user_pref("browser.search.countryCode", "US"); // (hidden pref)
user_pref("browser.search.region", "US"); // (hidden pref)
/* 0203: disable using OS locale, force APP locale ***/
user_pref("intl.locale.matchOS", false);
/* 0204: set APP locale ***/
user_pref("general.useragent.locale", "en-US");
/* 0206: disable geographically specific results/search engines eg: "browser.search.*.US"
 * i.e ignore all of Mozilla's various search engines in multiple locales ***/
user_pref("browser.search.geoSpecificDefaults", false);
user_pref("browser.search.geoSpecificDefaults.url", "");
/* 0207: set language to match ***/
user_pref("intl.accept_languages", "en-US, en");
/* 0208: enforce US English locale regardless of the system locale
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=867501 ***/
user_pref("javascript.use_us_english_locale", true); // (hidden pref)

/*** 0300: QUIET FOX [PART 1]
     No auto-phoning home for anything. You can still do manual updates. It is still important
     to do updates for security reasons. [WARNING] [SETUP] If you don't auto update, make sure you
     do manually. There are many legitimate reasons to turn off AUTO updates, including hijacked
     monetized extensions, time constraints, legacy issues, and fear of breakage/bugs ***/
user_pref("ghacks_user.js.parrot", "0300 syntax error: the parrot's not pinin' for the fjords!");
/* 0301a: disable browser auto update check
 * [SETTING] Options>Advanced>Update>Never check for updates ***/
user_pref("app.update.enabled", false);
/* 0301b: disable background update service
 * [SETTING] Options>Advanced>Update>Use a background service to install updates ***/
user_pref("app.update.service.enabled", false);
/* 0301c: ensure update information is not suppressed ***/
user_pref("app.update.silent", false);
/* 0301d: disable background update staging ***/
user_pref("app.update.staging.enabled", false);
/* 0302: disable browser auto update installing (after the check in 0301a) ***/
user_pref("app.update.auto", false);
/* 0303: disable search update
 * [SETTING] Options>Advanced>Update>Automatically update: search engines ***/
user_pref("browser.search.update", false);
/* 0304: disable add-ons auto update check ***/
user_pref("extensions.update.enabled", false);
/* 0305: disable add-ons auto update installing (after the check in 0304) ***/
user_pref("extensions.update.autoUpdateDefault", false);
/* 0306: disable add-on metadata updating
 * sends daily pings to Mozilla about extensions and recent startups ***/
user_pref("extensions.getAddons.cache.enabled", false);
/* 0307: disable auto updating of personas (themes) ***/
user_pref("lightweightThemes.update.enabled", false);
/* 0309: disable sending Flash crash reports ***/
user_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled", false);
/* 0310: disable sending the URL of the website where a plugin crashed ***/
user_pref("dom.ipc.plugins.reportCrashURL", false);
/* 0320: disable extension discovery
 * featured extensions for displaying in Get Add-ons panel ***/
user_pref("extensions.webservice.discoverURL", "http://127.0.0.1");
/* 0330a: disable telemetry
 * the pref (.unified) affects the behaviour of the pref (.enabled)
 * IF unified=false then .enabled controls the telemetry module
 * IF unified=true then .enabled ONLY controls whether to record extended data
 * so make sure to have both set as false
 * [1] https://gecko.readthedocs.org/en/latest/toolkit/components/telemetry/telemetry/preferences.html ***/
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.enabled", false);
/* 0330b: set unifiedIsOptIn to make sure telemetry respects OptIn choice and that telemetry
 * is enabled ONLY for people that opted into it, even if unified Telemetry is enabled ***/
user_pref("toolkit.telemetry.unifiedIsOptIn", true); // (hidden pref)
/* 0331: remove url of server telemetry pings are sent to ***/
user_pref("toolkit.telemetry.server", "");
/* 0332: disable archiving pings locally - irrelevant if toolkit.telemetry.unified is false ***/
user_pref("toolkit.telemetry.archive.enabled", false);
/* 0333a: disable health report ***/
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.healthreport.documentServerURI", ""); // (hidden pref)
user_pref("datareporting.healthreport.service.enabled", false); // (hidden pref)
/* 0333b: disable about:healthreport page (which connects to Mozilla for locale/css+js+json)
 * If you have disabled health reports, then this about page is useless - disable it
 * If you want to see what health data is present, then this must be set at default ***/
user_pref("datareporting.healthreport.about.reportUrl", "data:text/plain,");
/* 0334: disable new data submission, master kill switch (FF41+)
 * If disabled, no policy is shown or upload takes place, ever
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1195552 ***/
user_pref("datareporting.policy.dataSubmissionEnabled", false);
/* 0335: remove telemetry clientID ***/
user_pref("toolkit.telemetry.cachedClientID", "");
/* 0336: disable "Heartbeat" (Mozilla user rating telemetry)
 * [1] https://trac.torproject.org/projects/tor/ticket/18738 ***/
user_pref("browser.selfsupport.enabled", false); // (hidden pref)
user_pref("browser.selfsupport.url", "");
/* 0340: disable experiments
 * [1] https://wiki.mozilla.org/Telemetry/Experiments ***/
user_pref("experiments.enabled", false);
user_pref("experiments.manifest.uri", "");
user_pref("experiments.supported", false);
user_pref("experiments.activeExperiment", false);
/* 0341: disable Mozilla permission to silently opt you into tests ***/
user_pref("network.allow-experiments", false);
/* 0350: disable crash reports ***/
user_pref("breakpad.reportURL", "");
/* 0351: disable sending of crash reports (FF44+) ***/
user_pref("browser.tabs.crashReporting.sendReport", false);
user_pref("browser.crashReports.unsubmittedCheck.enabled", false); // (FF51+)
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit", false); // (FF51+)
/* 0360: disable new tab tile ads & preload & marketing junk ***/
user_pref("browser.newtab.preload", false);
user_pref("browser.newtabpage.directory.ping", "data:text/plain,");
user_pref("browser.newtabpage.directory.source", "data:text/plain,");
user_pref("browser.newtabpage.enabled", false);
user_pref("browser.newtabpage.enhanced", false);
user_pref("browser.newtabpage.introShown", true);
/* 0370: disable "Snippets" (Mozilla content shown on about:home screen)
 * MUST use HTTPS - arbitrary content injected into this page via http opens up MiTM attacks
 * [1] https://wiki.mozilla.org/Firefox/Projects/Firefox_Start/Snippet_Service ***/
user_pref("browser.aboutHomeSnippets.updateUrl", "https://127.0.0.1");
/* 0373: disable "Pocket" (third party "save for later" service) & remove urls for good measure
 * [NOTE] Important: Remove the pocket icon from your toolbar first
 * [1] https://www.gnu.gl/blog/Posts/multiple-vulnerabilities-in-pocket/ ***/
user_pref("extensions.pocket.enabled", false);
user_pref("extensions.pocket.api", "");
user_pref("extensions.pocket.site", "");
user_pref("extensions.pocket.oAuthConsumerKey", "");
/* 0374: disable "social" integration
 * [1] https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Social_API ***/
user_pref("social.whitelist", "");
user_pref("social.toast-notifications.enabled", false);
user_pref("social.shareDirectory", "");
user_pref("social.remote-install.enabled", false);
user_pref("social.directories", "");
user_pref("social.share.activationPanelEnabled", false);
user_pref("social.enabled", false); // (hidden pref)
/* 0376: disable FlyWeb, a set of APIs for advertising and discovering local-area web servers
 * [1] https://wiki.mozilla.org/FlyWeb
 * [2] http://www.ghacks.net/2016/07/26/firefox-flyweb/ ***/
user_pref("dom.flyweb.enabled", false);
/* 0380: disable sync [SETUP] ***/
user_pref("services.sync.enabled", false); // (hidden pref)
/* 0381: disable WebExtension sync
 * [1] https://wiki.mozilla.org/WebExtensions/chrome.storage.sync ***/
user_pref("webextensions.storage.sync.enabled", false);
user_pref("webextensions.storage.sync.serverURL", "");

/*** 0400: QUIET FOX [PART 2] [WARNING] [SETUP]
     This section has security & tracking protection implications vs privacy concerns vs effectiveness.
     These settings, WITH EXTENSIONS, are geared up to make Firefox "quiet", private and effective.
     We DO NOT advocate no protection, so use something with more scope, such as uBlock Origin.

     This entire section is rather contentious. Safebrowsing (SB) is designed to protect
     users from malicious sites. Tracking protection (TP) is designed to lessen the impact of third
     parties on websites to reduce tracking and to speed up your browsing experience. These are
     both very good features provided by Mozilla. They do rely on third parties: Google for
     safebrowsing and Disconnect for tracking protection (someone has to provide the information).
     Additionally, SSL Error Reporting helps makes the internet more secure for everyone.

     If you do not understand the ramifications of disabling SB and TP, then it is advised that
     you enable them by commenting out the preferences and saving the changes, and then in
     about:config find each entry and right-click and reset the preference's value.
***/
user_pref("ghacks_user.js.parrot", "0400 syntax error: the parrot's passed on!");
/* 0401: DON'T disable extension blocklist, but sanitize blocklist url
 * It now includes updates for "revoked certificates"
 * [1] https://blog.mozilla.org/security/2015/03/03/revoking-intermediate-certificates-introducing-onecrl
 * [2] https://trac.torproject.org/projects/tor/ticket/16931 ***/
user_pref("extensions.blocklist.enabled", true);
user_pref("extensions.blocklist.url", "https://blocklist.addons.mozilla.org/blocklist/3/%APP_ID%/%APP_VERSION%/");
/* 0402: disable/enable various Kinto blocklist updates (FF50+)
 * What is Kinto?: https://wiki.mozilla.org/Firefox/Kinto#Specifications
 * As Firefox transitions to Kinto, the blocklists have been broken down (more could be added). These contain
 * block entries for certs to be revoked, add-ons and plugins to be disabled, and gfx environments that
 * cause problems or crashes. Here you can remove the collection name to disable each specific list updating ***/
user_pref("services.blocklist.update_enabled", true);
user_pref("services.blocklist.signing.enforced", true);
user_pref("services.blocklist.onecrl.collection", "certificates"); // revoked certificates
user_pref("services.blocklist.addons.collection", "addons");
user_pref("services.blocklist.plugins.collection", ""); // if you have no plugins
user_pref("services.blocklist.gfx.collection", ""); // if gfx hw acceleration is disabled
/* 0410: disable Safe Browsing (SB)
 * This sub-section has been redesigned to differentiate between "real-time"/"user initiated"
 * data being sent to Google from all other settings such as using local blocklists/whitelists
 * and updating those lists. There SHOULD be NO privacy issues here. Even *IF* an URL was sent
 * to Google, they swear it is anonymized and only used to flag malicious sites/activity. Firefox
 * also takes measures such as striping out identifying parameters and storing safe browsing
 * cookies in a separate jar. (#Turn on browser.safebrowsing.debug to monitor this activity)
 * To use safebrowsing but not "leak" binary download info to Google, only use 0410e and 0410f
 * #Required reading [#] https://feeding.cloud.geek.nz/posts/how-safe-browsing-works-in-firefox/
 * [1] https://wiki.mozilla.org/Security/Safe_Browsing ***/
/* 0410a: disable "Block dangerous and deceptive content" (under Options>Security)
 * Until FF48 this was titled "Block reported web forgeries"
 * It covers deceptive sites such as phishing and social engineering ***/
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false); // (FF50+)
/* 0410b: disable "Block dangerous downloads" (under Options>Security)
 * Until FF48 this was titled "Block reported attack sites"
 * It covers malware and PUPs (potentially unwanted programs) ***/
user_pref("browser.safebrowsing.downloads.enabled", false);
/* 0410b: disable "Warn me about unwanted and uncommon software" (under Options>Security) (FF48+) ***/
user_pref("browser.safebrowsing.downloads.remote.block_potentially_unwanted", false);
user_pref("browser.safebrowsing.downloads.remote.block_uncommon", false);
user_pref("browser.safebrowsing.downloads.remote.block_dangerous", false); // (FF49+)
user_pref("browser.safebrowsing.downloads.remote.block_dangerous_host", false); // (FF49+)
/* 0410c: disable Google safebrowsing downloads, updates ***/
user_pref("browser.safebrowsing.provider.google.updateURL", ""); // update google lists
user_pref("browser.safebrowsing.provider.google.gethashURL", ""); // list hash check
user_pref("browser.safebrowsing.provider.google4.updateURL", ""); // (FF50+)
user_pref("browser.safebrowsing.provider.google4.gethashURL", ""); // (FF50+)
/* 0410d: disable Mozilla safebrowsing downloads, updates
 * [NOTE] These two prefs are also used for Tracking Protection (see 0420) ***/
user_pref("browser.safebrowsing.provider.mozilla.gethashURL", ""); // resolves hash conflicts
user_pref("browser.safebrowsing.provider.mozilla.updateURL", ""); // update FF lists
/* 0410e: disable binaries NOT in local lists being checked by Google (real-time checking) ***/
user_pref("browser.safebrowsing.downloads.remote.enabled", false);
user_pref("browser.safebrowsing.downloads.remote.url", "");
/* 0410f: disable reporting URLs ***/
user_pref("browser.safebrowsing.provider.google.reportURL", "");
user_pref("browser.safebrowsing.reportMalwareMistakeURL", "");
user_pref("browser.safebrowsing.reportPhishMistakeURL", "");
user_pref("browser.safebrowsing.reportPhishURL", "");
user_pref("browser.safebrowsing.provider.google4.reportURL", ""); // (FF50+)
/* 0410g: show=true or hide=false the 'ignore this warning' on Safe Browsing warnings which
 * when clicked bypasses the block for that session. This is a means for admins to enforce SB
 * [TEST] see github wiki APPENDIX C: Test Sites: Section 5
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1226490 ***/
   // user_pref("browser.safebrowsing.allowOverride", true);
/* 0420: disable Tracking Protection (TP)
 * There SHOULD be NO privacy concerns here, but we strongly recommend to use uBlock Origin instead,
 * which offers more comprehensive as well as specialized lists. It also allows per domain control.
 * [NOTE] There are two prefs (see 0410d) shared with Safe Browsing
 * [1] https://wiki.mozilla.org/Security/Tracking_protection
 * [2] https://support.mozilla.org/en-US/kb/tracking-protection-firefox ***/
user_pref("privacy.trackingprotection.enabled", false); // all windows pref (not just private)
user_pref("privacy.trackingprotection.pbmode.enabled", false); // private browsing pref
/* 0421: enable more Tracking Protection choices under Options>Privacy>Use Tracking Protection ***/
user_pref("privacy.trackingprotection.ui.enabled", true);
/* 0430: disable SSL Error Reporting
 * [1] https://gecko.readthedocs.org/en/latest/browser/base/sslerrorreport/preferences.html ***/
user_pref("security.ssl.errorReporting.automatic", false);
user_pref("security.ssl.errorReporting.enabled", false);
user_pref("security.ssl.errorReporting.url", "");
/* 0440: disable Mozilla's blocklist for known Flash tracking/fingerprinting (FF48+)
 * If you don't have Flash, then you don't need this enabled
 * [NOTE] if enabled, you will need to check what prefs (safebrowsing URLs etc) this uses to update
 * [1] http://www.ghacks.net/2016/07/18/firefox-48-blocklist-against-plugin-fingerprinting/
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1237198 ***/
user_pref("browser.safebrowsing.blockedURIs.enabled", false);

/*** 0600: BLOCK IMPLICIT OUTBOUND [not explicitly asked for - eg clicked on] ***/
user_pref("ghacks_user.js.parrot", "0600 syntax error: the parrot's no more!");
/* 0601: disable link prefetching
 * [1] https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ ***/
user_pref("network.prefetch-next", false);
/* 0602: disable DNS prefetching
 * [1] http://www.ghacks.net/2013/04/27/firefox-prefetching-what-you-need-to-know/
 * [2] https://developer.mozilla.org/en-US/docs/Web/HTTP/Controlling_DNS_prefetching ***/
user_pref("network.dns.disablePrefetch", true);
user_pref("network.dns.disablePrefetchFromHTTPS", true); // (hidden pref)
/* 0603a: disable Seer/Necko
 * [1] https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Necko ***/
user_pref("network.predictor.enabled", false);
/* 0603b: disable more Necko/Captive Portal
 * [1] https://en.wikipedia.org/wiki/Captive_portal
 * [2] https://wiki.mozilla.org/Necko/CaptivePortal ***/
user_pref("captivedetect.canonicalURL", "");
user_pref("network.captive-portal-service.enabled", false); // (FF52+)
/* 0605: disable link-mouseover opening connection to linked server
 * [1] http://news.slashdot.org/story/15/08/14/2321202/how-to-quash-firefoxs-silent-requests
 * [2] http://www.ghacks.net/2015/08/16/block-firefox-from-connecting-to-sites-when-you-hover-over-links ***/
user_pref("network.http.speculative-parallel-limit", 0);
/* 0606: disable pings (but enforce same host in case)
 * [1] http://kb.mozillazine.org/Browser.send_pings
 * [2] http://kb.mozillazine.org/Browser.send_pings.require_same_host ***/
user_pref("browser.send_pings", false);
user_pref("browser.send_pings.require_same_host", true);
/* 0607: stop links launching Windows Store on Windows 8/8.1/10
 * [1] http://www.ghacks.net/2016/03/25/block-firefox-chrome-windows-store/ ***/
user_pref("network.protocol-handler.external.ms-windows-store", false);
/* 0608: disable predictor / prefetching (FF48+) ***/
user_pref("network.predictor.enable-prefetch", false);

/*** 0800: LOCATION BAR / SEARCH BAR / SUGGESTIONS / HISTORY / FORMS [SETUP]
     If you are in a private environment (no unwanted eyeballs) and your device is private
     (restricted access), and the device is secure when unattended (locked, encrypted, forensic
     hardened), then items 0850 and above can be relaxed in return for more convenience and
     functionality. Likewise, you may want to check the items cleared on shutdown in section 2800.
     [NOTE] The urlbar is also commonly referred to as the location bar and address bar
     #Required reading [#] https://xkcd.com/538/
 ***/
user_pref("ghacks_user.js.parrot", "0800 syntax error: the parrot's ceased to be!");
/* 0801: disable location bar using search - PRIVACY
 * don't leak typos to a search engine, give an error message instead ***/
user_pref("keyword.enabled", false);
/* 0802: disable location bar domain guessing - PRIVACY/SECURITY
 * domain guessing intercepts DNS "hostname not found errors" and resends a
 * request (eg by adding www or .com). This is inconsistent use (eg FQDNs), does not work
 * via Proxy Servers (different error), is a flawed use of DNS (TLDs: why treat .com
 * as the 411 for DNS errors?), privacy issues (why connect to sites you didn't
 * intend to), can leak sensitive data (eg query strings: eg Princeton attack),
 * and is a security risk (eg common typos & malicious sites set up to exploit this) ***/
user_pref("browser.fixup.alternate.enabled", false);
/* 0803: display all parts of the url in the location bar - helps SECURITY ***/
user_pref("browser.urlbar.trimURLs", false);
/* 0804: limit history leaks via enumeration (PER TAB: back/forward) - PRIVACY
 * This is a PER TAB session history. You still have a full history stored under all history
 * default=50, minimum=1=currentpage, 2 is the recommended minimum as some pages
 * use it as a means of referral (eg hotlinking), 4 or 6 or 10 may be more practical ***/
user_pref("browser.sessionhistory.max_entries", 10);
/* 0805: disable CSS querying page history - CSS history leak - PRIVACY
 * [NOTE] this has NEVER been fully "resolved": in Mozilla/docs it is stated it's
 * only in 'certain circumstances', also see latest comments in [3]
 * [TEST] http://lcamtuf.coredump.cx/yahh/ (see github wiki APPENDIX C on how to use)
 * [1] https://dbaron.org/mozilla/visited-privacy
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=147777
 * [3] https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector ***/
user_pref("layout.css.visited_links_enabled", false);
/* 0806: disable displaying javascript in history URLs - SECURITY ***/
user_pref("browser.urlbar.filter.javascript", true);
/* 0807: disable search bar LIVE search suggestions - PRIVACY
 * [SETTING] Options>Search>Provide search suggestions ***/
user_pref("browser.search.suggest.enabled", false);
/* 0808: disable location bar LIVE search suggestions (requires 0807 = true) - PRIVACY
 * Also disable the location bar prompt to enable/disable or learn more about it.
 * [SETTING] Options>Search>Show search suggestions in location bar results ***/
user_pref("browser.urlbar.suggest.searches", false);
user_pref("browser.urlbar.userMadeSearchSuggestionsChoice", true); // (FF41+)
/* 0850a: disable location bar autocomplete ***/
user_pref("browser.urlbar.autocomplete.enabled", false);
/* 0850b: disable location bar dropdown
 * This value used to control the maximum number of entries that could appear in the location
 * bar dropdown. This is no longer the case, and thus, it does *NOT* hide any suggestions ***/
   // user_pref("browser.urlbar.maxRichResults", 0);
/* 0850c: disable location bar suggestion types
 * [SETTING] Options>Privacy>Location Bar>When using the location bar, suggest
 * [NOTE] If you wish to enable these suggestions, make sure 0850a is at default ***/
user_pref("browser.urlbar.suggest.history", false);
user_pref("browser.urlbar.suggest.bookmark", false);
user_pref("browser.urlbar.suggest.openpage", false);
/* 0850d: disable location bar autofill
 * [1] http://kb.mozillazine.org/Inline_autocomplete ***/
user_pref("browser.urlbar.autoFill", false);
user_pref("browser.urlbar.autoFill.typed", false);
/* 0850e: disable location bar one-off searches (FF51+)
 * [1] http://www.ghacks.net/2016/08/09/firefox-one-off-searches-address-bar/ ***/
user_pref("browser.urlbar.oneOffSearches", false);
/* 0860: disable search and form history
 * [SETTING] Options>Privacy>History>Custom Settings>Remember search and form history
 * [NOTE] You can clear formdata on exiting Firefox (see 2803) ***/
   // user_pref("browser.formfill.enable", false);
/* 0861: disable saving form history on secure websites
 * For convenience & functionality, this is best left at default true,
 * especially as the web moves more and more to encrypted services
 * You can clear form history on exiting Firefox (see 2803) ***/
   // user_pref("browser.formfill.saveHttpsForms", false);
/* 0862: disable browsing and download history
 * [SETTING] Options>Privacy>History>Custom Settings>Remember my browsing and download history
 * [NOTE] You can clear history and downloads on exiting Firefox (see 2803) ***/
   // user_pref("places.history.enabled", false);
/* 0870: disable Windows jumplist ***/
user_pref("browser.taskbar.lists.enabled", false);
user_pref("browser.taskbar.lists.frequent.enabled", false);
user_pref("browser.taskbar.lists.recent.enabled", false);
user_pref("browser.taskbar.lists.tasks.enabled", false);
/* 0871: disable Windows taskbar preview ***/
user_pref("browser.taskbar.previews.enable", false);

/*** 0900: PASSWORDS ***/
user_pref("ghacks_user.js.parrot", "0900 syntax error: the parrot's expired!");
/* 0901: disable saving passwords
 * [SETTING] Options>Security>Logins>Remember logins for sites
 * [NOTE] this does not clear any passwords already saved ***/
   // user_pref("signon.rememberSignons", false);
/* 0902: use a master password (recommended if you save passwords)
 * There are no preferences for this. It is all handled internally.
 * [1] https://support.mozilla.org/en-US/kb/use-master-password-protect-stored-logins ***/
/* 0903: set how often Mozilla should ask for the master password
 * 0=the first time (default), 1=every time it's needed, 2=every n minutes (as per the next pref) ***/
user_pref("security.ask_for_password", 2);
/* 0904: how often in minutes Mozilla should ask for the master password (see pref above)
 * in minutes, default is 30 ***/
user_pref("security.password_lifetime", 5);
/* 0905: disable auto-filling username & password form fields - SECURITY
 * can leak in cross-site forms AND be spoofed
 * [NOTE] password will still be auto-filled after a user name is manually entered
 * [1] http://kb.mozillazine.org/Signon.autofillForms ***/
user_pref("signon.autofillForms", false);
/* 0906: ignore websites' autocomplete="off" (FF30+)
 * Don't let sites dictate use of saved logins and passwords. Increase security through
 * stronger password use. The trade-off is the convenience. Some sites should never be
 * saved (such as banking sites). Set at true, informed users can make their own choice. ***/
user_pref("signon.storeWhenAutocompleteOff", true);
/* 0907: force warnings for logins on non-secure (non HTTPS) pages
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1217156 ***/
user_pref("security.insecure_password.ui.enabled", true);
/* 0908: When attempting to fix an entered URL, do not fix an entered password along with it
 * i.e do not turn ~http://user:password@foo into ~http://user:password@(prefix)foo(suffix)
 * but instead ~http://user@(prefix)foo(suffix) ***/
user_pref("browser.fixup.hide_user_pass", true);
/* 0909: disable formless login capture for Password Manager (FF51+) ***/
user_pref("signon.formlessCapture.enabled", false);
/* 0910: enforce disable autofilling saved password on HTTP pages and show warning (FF52+)
 * [1] https://www.fxsitecompat.com/en-CA/docs/2017/insecure-login-forms-now-disable-autofill-show-warning-beneath-input-control/ ***/
user_pref("signon.autofillForms.http", false);
user_pref("security.insecure_field_warning.contextual.enabled", true);

/*** 1000: CACHE [SETUP] ***/
user_pref("ghacks_user.js.parrot", "1000 syntax error: the parrot's gone to meet 'is maker!");
/** CACHE ***/
/* 1001: disable disk cache ***/
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.disk.capacity", 0);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.cache.disk.smart_size.first_run", false);
/* 1002: disable disk cache for SSL pages
 * [1] http://kb.mozillazine.org/Browser.cache.disk_cache_ssl ***/
user_pref("browser.cache.disk_cache_ssl", false);
/* 1003: disable memory cache ***/
   // user_pref("browser.cache.memory.enable", false);
/* 1004: disable offline cache ***/
user_pref("browser.cache.offline.enable", false);
/* 1005: disable fastback cache
 * To improve performance when pressing back/forward Firefox stores visited pages
 * so they don't have to be re-parsed. This is not the same as memory cache.
 * 0=none, -1=auto (that's minus 1), or for other values see [1]
 * [1] http://kb.mozillazine.org/Browser.sessionhistory.max_total_viewers ***/
   // user_pref("browser.sessionhistory.max_total_viewers", 0);
/* 1006: disable permissions manager from writing to disk (requires restart)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=967812 ***/
   // user_pref("permissions.memory_only", true); // (hidden pref)
/* 1007: disable randomized FF HTTP cache decay experiments
 * [1] https://trac.torproject.org/projects/tor/ticket/13575 ***/
user_pref("browser.cache.frecency_experiment", -1);
/* 1008: set DNS cache and expiration time (default 400 and 60, same as TBB) ***/
   // user_pref("network.dnsCacheEntries", 400);
   // user_pref("network.dnsCacheExpiration", 60);
/** SESSIONS & SESSION RESTORE ***/
/* 1020: disable the Session Restore service completely
 * [WARNING] [SETUP] This also disables the "Recently Closed Tabs" feature
 * It does not affect "Recently Closed Windows" or any history. ***/
user_pref("browser.sessionstore.max_tabs_undo", 0);
user_pref("browser.sessionstore.max_windows_undo", 0);
/* 1021: disable storing extra session data
 * extra session data contains contents of forms, scrollbar positions, cookies and POST data
 * define on which sites to save extra session data:
 * 0=everywhere, 1=unencrypted sites, 2=nowhere ***/
user_pref("browser.sessionstore.privacy_level", 2);
/* 1022: disable resuming session from crash [SETUP] ***/
user_pref("browser.sessionstore.resume_from_crash", false);
/* 1023: If you use session restore, increasing the minimal interval between two session save
 * operations can help on older machines and some websites, as well as reducing writes, see [1]
 * Default is 15000 (15 secs). Try 30000 (30sec), 60000 (1min) etc
 * [WARNING] This can also affect entries in the "Recently Closed Tabs" feature:
 * i.e the longer the interval the more chance a quick tab open/close won't be captured.
 * This longer interval *may* affect history but we cannot replicate any history not recorded
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1304389 ***/
user_pref("browser.sessionstore.interval", 30000);
/** FAVICONS ***/
/* 1030: disable favicons in shortcuts
 * URL shortcuts use a cached randomly named .ico file which is stored in your
 * profile/shortcutCache directory. The .ico remains after the shortcut is deleted.
 * If set to false then the shortcuts use a generic Firefox icon ***/
user_pref("browser.shell.shortcutFavicons", false);
/* 1031: disable favicons in tabs and new bookmarks
 * bookmark favicons are stored as data blobs in places.sqlite>moz_favicons ***/
   // user_pref("browser.chrome.site_icons", false);
   // user_pref("browser.chrome.favicons", false);
/* 1032: disable favicons in web notifications ***/
   // user_pref("alerts.showFavicons", false);

/*** 1100: MULTI-PROCESS (e10s)
     We recommend you let Firefox handle this. Until e10s is enforced, if
     - all your add-ons have the 'multiprocessCompatible' flag as true, then FF = e10s
     - any add-ons have 'multiprocessCompatible' flag as false, then FF != e10s
     - any add-ons are missing the 'multiprocessCompatible' flag *might* be disabled (FF53+)
     [1] https://blog.mozilla.org/addons/2017/02/16/the-road-to-firefox-57-compatibility-milestones/
***/
/* 1101: start the browser in e10s mode (FF48+)
 * about:support>Application Basics>Multiprocess Windows ***/
   // user_pref("browser.tabs.remote.autostart", true);
   // user_pref("browser.tabs.remote.autostart.2", true); // (FF49+) (hidden pref)
   // user_pref("browser.tabs.remote.force-enable", true); // (hidden pref)
   // user_pref("extensions.e10sBlocksEnabling", false);
/* 1102: control number of e10s processes
 * [1] http://www.ghacks.net/2016/02/15/change-how-many-processes-multi-process-firefox-uses/
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1207306 ***/
   // user_pref("dom.ipc.processCount", 4);
/* 1103: enable WebExtension add-on code to run in a separate process (webext-oop) (FF53+)
 * [1] https://wiki.mozilla.org/WebExtensions/Implementing_APIs_out-of-process */
   // user_pref("extensions.webextensions.remote", true);
/* 1104: enforce separate content process for file://URLs (FF53+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1147911
 * [2] http://www.ghacks.net/2016/11/27/firefox-53-exclusive-content-process-for-local-files/ ***/
   // user_pref("browser.tabs.remote.separateFileUriProcess", true);
/* 1105: enable console shim warnings for add-ons with the 'multiprocessCompatible' flag as false ***/
user_pref("dom.ipc.shims.enabledWarnings", true);
/* 1110: set sandbox level. DO NOT MEDDLE WITH THESE. They are included to inform you NOT to play
 * with them. The values are integers, but the code below deliberately contains a data mismatch
 * [1] https://wiki.mozilla.org/Sandbox
 * [2] http://www.ghacks.net/2017/01/23/how-to-change-firefoxs-sandbox-security-level/#comment-4105173 */
   // user_pref("security.sandbox.content.level", "donotuse")
   // user_pref("dom.ipc.plugins.sandbox-level.default", "donotuse");
   // user_pref("dom.ipc.plugins.sandbox-level.flash, "donotuse");

/*** 1200: HTTPS ( SSL/TLS / OCSP / CERTS / HSTS / HPKP / CIPHERS )
   Note that your cipher and other settings can be used server side as a fingerprint attack
   vector, see [1] (It's quite technical but the first part is easy to understand
   and you can stop reading when you reach the second section titled "Enter Bro")

   Option 1: Use our settings to tighten up encryption options. It *is* a fingerprinting attack
             vector, and we certainly do want to reduce any attack surface, but this is not how
             you *DEFEAT* fingerprinting - to do that you need large numbers to buy into the same
             enforced browser-wide settings (such as TBB), and/or you use OpSec.
   Option 2: Use Firefox defaults for the 1260's items (item 1260 default for SHA-1, is local only
             anyway). There is nothing *weak* about Firefox's defaults, but Mozilla (and other
             browsers) will always lag for fear of breakage and upset end-users

   [1] https://www.securityartwork.es/2017/02/02/tls-client-fingerprinting-with-bro/
 ***/
user_pref("ghacks_user.js.parrot", "1200 syntax error: the parrot's a stiff!");
/** SSL (Secure Sockets Layer) / TLS (Transport Layer Security) ***/
/* 1201: reject communication with servers using old SSL/TLS - vulnerable to a MiTM attack
 * [WARNING] tested Feb 2017 - still breaks too many sites
 * [1] https://wiki.mozilla.org/Security:Renegotiation ***/
   // user_pref("security.ssl.require_safe_negotiation", true);
/* 1202: control TLS versions with min and max
 * 1=min version of TLS 1.0, 2-min version of TLS 1.1, 3=min version of TLS 1.2 etc
 * [WARNING] FF/chrome currently allow TLS 1.0 by default, so this is your call.
 * [1] http://kb.mozillazine.org/Security.tls.version.*
 * [2] https://www.ssl.com/how-to/turn-off-ssl-3-0-and-tls-1-0-in-your-browser/ ***/
   // user_pref("security.tls.version.min", 2);
   // user_pref("security.tls.version.fallback-limit", 3);
   // user_pref("security.tls.version.max", 4); // 4 = allow up to and including TLS 1.3
/* 1203: disable SSL session tracking (FF36+)
 * SSL Session IDs speed up HTTPS connections (no need to renegotiate) and last for 48hrs.
 * Since the ID is unique, web servers can (and do) use it for tracking. If set to true,
 * this disables sending SSL Session IDs and TLS Session Tickets to prevent session tracking
 * [1] https://tools.ietf.org/html/rfc5077
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=967977 ***/
user_pref("security.ssl.disable_session_identifiers", true); // (hidden pref)
/** OCSP (Online Certificate Status Protocol) ***/
/* 1210: enable OCSP Stapling
 * [1] https://blog.mozilla.org/security/2013/07/29/ocsp-stapling-in-firefox/ ***/
user_pref("security.ssl.enable_ocsp_stapling", true);
/* 1211: query OCSP responder servers to confirm current validity of certificates
 * 0=disable, 1=validate only certificates that specify an OCSP service URL (default)
 * 2=enable and use values in security.OCSP.URL and security.OCSP.signing.
 * OCSP (non-stapled) leaks information about the sites you visit to the CA (cert authority)
 * It's a trade-off between security (checking) and privacy (leaking info to the CA)
 * [1] https://en.wikipedia.org/wiki/Ocsp ***/
user_pref("security.OCSP.enabled", 1);
/* 1212: require certificate revocation check through OCSP protocol
 * [WARNING] Since FF44 the default is false. If set to true, this may/will cause some
 * site breakage. Some users have previously mentioned issues with youtube, microsoft etc ***/
   // user_pref("security.OCSP.require", true);
/** CERTS / HSTS (HTTP Strict Transport Security) / HPKP (HTTP Public Key Pinning) ***/
/* 1220: disable Microsoft Family Safety cert (Windows 8.1) (FF50+)
 * 0 = disable detecting Family Safety mode and importing the root
 * 1 = only attempt to detect Family Safety mode (don't import the root)
 * 2 = detect Family Safety mode and import the root ***/
user_pref("security.family_safety.mode", 0);
/* 1221: disable intermediate certificate caching (fingerprinting attack vector)
 * [NOTE] This may be better handled under FPI (ticket 1323644, part of Tor Uplift)
 * [WARNING] This affects login/cert/key dbs. The effect is all credentials are session-only.
 * Saved logins and passwords are not available. Reset the pref and restart to return them.
 * [TEST] https://fiprinca.0x90.eu/poc/
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1334485 - related bug
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1216882 - related bug (see comment 9) ***/
   // user_pref("security.nocertdb", true); // (hidden pref)
/* 1222: enforce strict pinning
 ** PKP (Public Key Pinning) 0=disabled 1=allow user MiTM (such as your antivirus), 2=strict
 * [WARNING] If you rely on an AV (antivirus) to protect your web browsing
 * by inspecting ALL your web traffic, then leave at current default=1
 * [1] https://trac.torproject.org/projects/tor/ticket/16206 ***/
user_pref("security.cert_pinning.enforcement_level", 2);
/* 1223: enforce HSTS preload list (default is true)
 * The list is compiled into Firefox and used to always load those domains over HTTPS
 * [1] https://blog.mozilla.org/security/2012/11/01/preloading-hsts/
 * [2] https://wiki.mozilla.org/Privacy/Features/HSTS_Preload_List ***/
user_pref("network.stricttransportsecurity.preloadlist", true);
/** MIXED CONTENT ***/
/* 1240: disable insecure active content on https pages - mixed content ***/
user_pref("security.mixed_content.block_active_content", true);
/* 1241: disable insecure passive content (such as images) on https pages - mixed context
 * [WARNING] when set to true, this will visually break many sites (March 2017) ***/
   // user_pref("security.mixed_content.block_display_content", true);
/* 1242: allow Mixed-Content-Blocker to use the HSTS cache but disable the HSTS Priming requests (FF51+)
 * Allow resources from domains with an existing HSTS cache record or in the HSTS preload list
 * to be upgraded to HTTPS internally but disable sending out HSTS Priming requests, because
 * those may cause noticeable delays eg requests time out or are not handled well by servers
 * [NOTE] if you want to use the priming requests make sure 'use_hsts' is also true
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1246540#c145 ***/
user_pref("security.mixed_content.use_hsts", true);
user_pref("security.mixed_content.send_hsts_priming", false);
/** CIPHERS [see the section 1200 intro] ***/
/* 1260: disable or limit SHA-1
 * 0 = all SHA1 certs are allowed
 * 1 = all SHA1 certs are blocked (including perfectly valid ones from 2015 and earlier)
 * 2 = deprecated option that now maps to 1
 * 3 = only allowed for locally-added roots (e.g. anti-virus)
 * 4 = only allowed for locally-added roots or for certs in 2015 and earlier
 * [WARNING] when disabled, some man-in-the-middle devices (eg security scanners and
 *  antivirus products, may fail to connect to HTTPS sites. SHA-1 is *almost* obsolete.
 * [1] https://blog.mozilla.org/security/2016/10/18/phasing-out-sha-1-on-the-public-web/ ***/
user_pref("security.pki.sha1_enforcement_level", 1);
/* 1261: disable 3DES (effective key size < 128)
 * [1] https://en.wikipedia.org/wiki/3des#Security
 * [2] http://en.citizendium.org/wiki/Meet-in-the-middle_attack
 * [3] http://www-archive.mozilla.org/projects/security/pki/nss/ssl/fips-ssl-ciphersuites.html ***/
user_pref("security.ssl3.rsa_des_ede3_sha", false);
/* 1262: disable 128 bits ***/
user_pref("security.ssl3.ecdhe_ecdsa_aes_128_sha", false);
user_pref("security.ssl3.ecdhe_rsa_aes_128_sha", false);
/* 1263: disable DHE (Diffie-Hellman Key Exchange)
 * [WARNING] may break obscure sites, but not major sites, which should support ECDH over DHE
 * [1] https://www.eff.org/deeplinks/2015/10/how-to-protect-yourself-from-nsa-attacks-1024-bit-DH ***/
user_pref("security.ssl3.dhe_rsa_aes_128_sha", false);
user_pref("security.ssl3.dhe_rsa_aes_256_sha", false);
/* 1264: disable the remaining non-modern cipher suites as of FF52
 * [NOTE] commented out because it still breaks too many sites ***/
   // user_pref("security.ssl3.rsa_aes_128_sha", false);
   // user_pref("security.ssl3.rsa_aes_256_sha", false);
/** UI (User Interface) ***/
/* 1270: display warning (red padlock) for "broken security"
 * [1] https://wiki.mozilla.org/Security:Renegotiation ***/
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
/* 1271: control "Add Security Exception" dialog on SSL warnings
 * 0=do neither 1=pre-populate url 2+pre-populate url + pre-fetch cert (default)
 * [1] https://github.com/pyllyukko/user.js/issues/210 ***/
user_pref("browser.ssl_override_behavior", 1);
/* 1272: display advanced information on Insecure Connection warning pages
 * only works when it's possible to add an exception
 * i.e doesn't work for HSTS discrepancies (https://subdomain.preloaded-hsts.badssl.com/)
 * [TEST] https://expired.badssl.com/ ***/
user_pref("browser.xul.error_pages.expert_bad_cert", true);

/*** 1400: FONTS ***/
user_pref("ghacks_user.js.parrot", "1400 syntax error: the parrot's bereft of life!");
/* 1401: disable websites choosing fonts (0=block, 1=allow)
 * If you disallow fonts, this drastically limits/reduces font
 * enumeration (by JS) which is a high entropy fingerprinting vector.
 * [SETTING] Options>Content>Font & Colors>Advanced>Allow pages to choose...
 * [SETUP] Disabling fonts can uglify the web a fair bit. ***/
user_pref("browser.display.use_document_fonts", 0);
/* 1402: allow icon fonts (glyphs) (FF41+) ***/
user_pref("gfx.downloadable_fonts.enabled", true);
/* 1403: disable rendering of SVG OpenType fonts
 * [1] https://wiki.mozilla.org/SVGOpenTypeFonts - iSECPartnersReport recommends to disable this ***/
user_pref("gfx.font_rendering.opentype_svg.enabled", false);
/* 1404: use more legible default fonts
 * [SETTING] Options>Fonts & Colors>Advanced>Serif|Sans-serif|Monospace
 * [SETUP] These are optional, comment out if you do not require them
 * [NOTE] Been using this for well over a year, it really grows on you ***/
user_pref("font.name.serif.x-unicode", "Georgia");
user_pref("font.name.serif.x-western", "Georgia"); // default Times New Roman
user_pref("font.name.sans-serif.x-unicode", "Arial");
user_pref("font.name.sans-serif.x-western", "Arial"); // default Arial
user_pref("font.name.monospace.x-unicode", "Lucida Console");
user_pref("font.name.monospace.x-western", "Lucida Console"); // default Courier New
/* 1405: disable WOFF2 (Web Open Font Format) ***/
user_pref("gfx.downloadable_fonts.woff2.enabled", false);
/* 1406: disable CSS Font Loading API
 * [SETUP] Disabling fonts can uglify the web a fair bit. ***/
user_pref("layout.css.font-loading-api.enabled", false);
/* 1407: remove special underline handling for a few fonts which you will probably never use.
 * Any of these fonts on your system can be enumerated for fingerprinting. Requires restart.
 * [1] http://kb.mozillazine.org/Font.blacklist.underline_offset ***/
user_pref("font.blacklist.underline_offset", "");
/* 1408: disable graphite which FF49 turned back on by default
 * In the past it had security issues - need citation ***/
user_pref("gfx.font_rendering.graphite.enabled", false);
/* 1409: only expose whitelisted system fonts (FF52+)
 * If the whitelist is empty, then whitelisting is considered disabled and all fonts are allowed.
 * [NOTE] Creating your own probably highly-unique whitelist will raise your entropy. If
 * you block sites choosing fonts in 1401, this preference is irrelevant. In future,
 * privacy.resistFingerprinting (see 2699) may cover this, and 1401 can be relaxed.
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1121643 ***/
   // user_pref("font.system.whitelist", ""); // (hidden pref)

/*** 1600: HEADERS / REFERERS [SETUP]
     Except for DNT (Do Not Track), referers are best controlled by an extension.
     It is important to realize that it is *cross domain* referers that need
     controlling, and this is best handled by EITHER 1603 or 1604, not both.

     Option 1: Recommended: Use an extension to block all referers, and then whitelist
               sites on a granular, per domain level.
     Option 2: As per the original settings below: Set XOriginPolicy (1603) to 1 (less breakage)
               or 2 (more breakage) and leave XOriginTrimmingPolicy (1604) at default 0
     Option 3: Set XOriginPolicy (1603) to default 0 and set XOriginTrimmingPolicy (1604) to 2

                    full URI: https://example.com:8888/foo/bar.html?id=1234
       scheme+host+path+port: https://example.com:8888/foo/bar.html
            scheme+host+port: https://example.com:8888

     #Required reading [#] https://feeding.cloud.geek.nz/posts/tweaking-referrer-for-privacy-in-firefox/
 ***/
user_pref("ghacks_user.js.parrot", "1600 syntax error: the parrot rests in peace!");
/* 1601: ALL: control when images/links send a referer
 * 0=never, 1=send only when links are clicked, 2=for links and images (default)
 * [NOTE] Recommended left at default. Focus on XSS and granular cross origin referer control ***/
user_pref("network.http.sendRefererHeader", 2);
/* 1602: ALL: control the amount of information to send
 * 0=send full URI (default), 1=scheme+host+path+port, 2=scheme+host+port
 * [NOTE] Cross origin requests can be fine tuned in 1603 + 1604. Limiting same origin requests
 * is rather pointless. Recommended left at default for zero same origin breakage ***/
user_pref("network.http.referer.trimmingPolicy", 0);
/* 1603: CROSS ORIGIN: fine-tune when to send a referer [SETUP]
 * 0=always (default), 1=only if base domains match, 2=only if hosts match
 * [NOTE] 1 = less breakage, possible leakage 2 = less leakage, more breakage ***/
user_pref("network.http.referer.XOriginPolicy", 1);
/* 1604: CROSS ORIGIN: control the amount of information to send (FF52+)
 * 0=send full URI (default) 1=scheme+host+path+port 2=scheme+host+port ***/
user_pref("network.http.referer.XOriginTrimmingPolicy", 0);
/* 1605: ALL: disable spoofing a referer
 * Spoofing increases your exposure to cross-site request forgeries ***/
user_pref("network.http.referer.spoofSource", false);
/* 1606: ALL: set the default Referrer Policy (FF53+)
 * 0=no-referer 1=same-origin 2=strict-origin-when-cross-origin
 * 3=no-referrer-when-downgrade (default)
 * [NOTE] This is only a default, it can be overridden by a site-controlled Referrer Policy
 * [1] https://www.w3.org/TR/referrer-policy/
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1304623 ***/
   // user_pref("network.http.referer.userControlPolicy", 3);
/* 1610: ALL: disable the DNT HTTP header (this is essentially USELESS and raises entropy)
 * [SETTING] Options>Privacy>Tracking>Request that sites not track you
 * [NOTE] if you use NoScript MAKE SURE to set the pref noscript.doNotTrack.enabled to match ***/
user_pref("privacy.donottrackheader.enabled", false);

/*** 1800: PLUGINS ***/
user_pref("ghacks_user.js.parrot", "1800 syntax error: the parrot's pushing up daisies!");
/* 1801: set default plugin state (i.e new plugins on discovery) to never activate
 * 0=disabled, 1=ask to activate, 2=active - you can override individual plugins ***/
user_pref("plugin.default.state", 0);
user_pref("plugin.defaultXpi.state", 0);
/* 1802: enable click to play and set to 0 minutes ***/
user_pref("plugins.click_to_play", true);
user_pref("plugin.sessionPermissionNow.intervalInMinutes", 0);
/* 1803: make sure a plugin is in a certain state: 0=deactivated 1=ask 2=enabled (Flash example)
 * you can set all these plugin.state's via Add-ons>Plugins or search for plugin.state in about:config
 * [NOTE] you can still over-ride individual sites eg youtube via site permissions
 * [1] http://www.ghacks.net/2013/07/09/how-to-make-sure-that-a-firefox-plugin-never-activates-again/ ***/
   // user_pref("plugin.state.flash", 0);
/* 1804: disable plugins using external/untrusted scripts with XPCOM or XPConnect ***/
user_pref("security.xpconnect.plugin.unrestricted", false);
/* 1805: disable scanning for plugins
 * [1] http://kb.mozillazine.org/Plugin_scanning
 * plid.all = whether to scan the directories specified in the Windows registry for PLIDs
 * includes: RealPlayer, Next-Generation Java Plug-In, Adobe Flash, Antivirus etc
 * [WARNING] [SETUP] This means Firefox will not load ANY plugins. Try it. You are not missing anything. ***/
user_pref("plugin.scan.plid.all", false);
/* 1820: disable all GMP (Gecko Media Plugins) [SETUP]
 * [1] https://wiki.mozilla.org/GeckoMediaPlugins ***/
user_pref("media.gmp-provider.enabled", false);
user_pref("media.gmp.trial-create.enabled", false);
/* 1825: disable widevine CDM (Content Decryption Module) [SETUP] ***/
user_pref("media.gmp-widevinecdm.visible", false);
user_pref("media.gmp-widevinecdm.enabled", false);
user_pref("media.gmp-widevinecdm.autoupdate", false);
/* 1830: disable all DRM content (EME: Encryption Media Extension) [SETUP] ***/
user_pref("media.eme.enabled", false); // Options>Content>Play DRM Content
user_pref("browser.eme.ui.enabled", false); // hides "Play DRM Content" checkbox, restart required
user_pref("media.eme.apiVisible", false); // block websites detecting DRM is disabled
/* 1840: disable the OpenH264 Video Codec by Cisco to "Never Activate"
 * and disable pings to the external update/download server
 * This is the bundled codec used for video chat in WebRTC ***/
user_pref("media.gmp-gmpopenh264.enabled", false); // (hidden pref)
user_pref("media.gmp-gmpopenh264.autoupdate", false);
user_pref("media.gmp-manager.url", "data:text/plain,");

/*** 2000: MEDIA / CAMERA / MIKE ***/
user_pref("ghacks_user.js.parrot", "2000 syntax error: the parrot's snuffed it!");
/* 2001: disable WebRTC (Web Real-Time Communication)
 * [1] https://www.privacytools.io/#webrtc ***/
user_pref("media.peerconnection.enabled", false);
user_pref("media.peerconnection.use_document_iceservers", false);
user_pref("media.peerconnection.video.enabled", false);
user_pref("media.peerconnection.identity.enabled", false);
user_pref("media.peerconnection.identity.timeout", 1);
user_pref("media.peerconnection.turn.disable", true);
user_pref("media.navigator.video.enabled", false); // video capability for WebRTC
/* 2002: pref which improves the WebRTC IP Leak issue, as opposed to completely
 * disabling WebRTC. You still need to enable WebRTC for this to be applicable (FF42+)
 * [1] https://wiki.mozilla.org/Media/WebRTC/Privacy ***/
user_pref("media.peerconnection.ice.default_address_only", true); // (FF41-FF50)
user_pref("media.peerconnection.ice.no_host", true); // (FF51+)
/* 2010: disable WebGL (Web Graphics Library), force bare minimum feature set if used & disable WebGL extensions
 * [1] http://www.contextis.com/resources/blog/webgl-new-dimension-browser-exploitation/
 * [2] https://security.stackexchange.com/questions/13799/is-webgl-a-security-concern ***/
user_pref("webgl.disabled", true);
user_pref("pdfjs.enableWebGL", false);
user_pref("webgl.min_capability_mode", true);
user_pref("webgl.disable-extensions", true);
user_pref("webgl.disable-fail-if-major-performance-caveat", true);
/* 2011: don't make WebGL debug info available to websites
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1171228
 * [2] https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info ***/
user_pref("webgl.enable-debug-renderer-info", false);
/* 2012: two more webgl preferences (FF51+) ***/
user_pref("webgl.dxgl.enabled", false);
user_pref("webgl.enable-webgl2", false);
/* 2021: disable speech recognition
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
 * [2] https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
 * [3] https://wiki.mozilla.org/HTML5_Speech_API ***/
user_pref("media.webspeech.recognition.enable", false);
user_pref("media.webspeech.synth.enabled", false);
/* 2022: disable screensharing ***/
user_pref("media.getusermedia.screensharing.enabled", false);
user_pref("media.getusermedia.screensharing.allowed_domains", "");
user_pref("media.getusermedia.browser.enabled", false);
user_pref("media.getusermedia.audiocapture.enabled", false);
/* 2023: disable camera stuff ***/
user_pref("camera.control.face_detection.enabled", false);
/* 2024: enable/disable MSE (Media Source Extensions)
 * [1] http://www.ghacks.net/2014/05/10/enable-media-source-extensions-firefox/ ***/
user_pref("media.mediasource.enabled", true);
user_pref("media.mediasource.mp4.enabled", true);
user_pref("media.mediasource.webm.audio.enabled", true);
user_pref("media.mediasource.webm.enabled", true);
/* 2026: disable canvas capture stream
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream ***/
user_pref("canvas.capturestream.enabled", false);
/* 2027: disable camera image capture
 * [1] https://trac.torproject.org/projects/tor/ticket/16339 ***/
user_pref("dom.imagecapture.enabled", false);
/* 2028: disable offscreen canvas
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas ***/
user_pref("gfx.offscreencanvas.enabled", false);
/* 2030: disable auto-play of HTML5 media
 * [WARNING] This may break video playback on various sites ***/
user_pref("media.autoplay.enabled", false);
/* 2031: disable audio auto-play in non-active tabs (FF51+)
 * [1] http://www.ghacks.net/2016/11/14/firefox-51-blocks-automatic-audio-playback-in-non-active-tabs/ ***/
user_pref("media.block-autoplay-until-in-foreground", true);

/*** 2200: UI MEDDLING
   see http://kb.mozillazine.org/Prevent_websites_from_disabling_new_window_features ***/
user_pref("ghacks_user.js.parrot", "2200 syntax error: the parrot's 'istory!");
/* 2201: disable website control over browser right-click context menu
 * [NOTE] Shift-Right-Click will always bring up the browser right-click context menu ***/
   // user_pref("dom.event.contextmenu.enabled", false);
/* 2202: UI SPOOFING: disable scripts hiding or disabling the following on new windows ***/
user_pref("dom.disable_window_open_feature.location", true);
user_pref("dom.disable_window_open_feature.menubar", true);
user_pref("dom.disable_window_open_feature.resizable", true);
user_pref("dom.disable_window_open_feature.status", true);
user_pref("dom.disable_window_open_feature.toolbar", true);
/* 2203: POPUP windows - prevent or allow javascript UI meddling ***/
user_pref("dom.disable_window_flip", true); // window z-order
user_pref("dom.disable_window_move_resize", true);
user_pref("dom.disable_window_open_feature.close", true);
user_pref("dom.disable_window_open_feature.minimizable", true);
user_pref("dom.disable_window_open_feature.personalbar", true); //bookmarks toolbar
user_pref("dom.disable_window_open_feature.titlebar", true);
user_pref("dom.disable_window_status_change", true);
user_pref("dom.allow_scripts_to_close_windows", false);
/* 2204: disable links opening in a new window
 * This is to stop malicious window sizes and screen res leaks etc in conjunction
 * with 2203 dom.disable_window_move_resize=true | 2418 full-screen-api.enabled=false
 * [NOTE] You can still right click a link and select open in a new window
 * [TEST] https://people.torproject.org/~gk/misc/entire_desktop.html
 * [1] https://trac.torproject.org/projects/tor/ticket/9881 ***/
user_pref("browser.link.open_newwindow.restriction", 0);
/* 2205: disable "Confirm you want to leave" dialog on page close
 * Does not prevent JS leaks of the page close event.
 * [1] https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
 * [2] https://support.mozilla.org/en-US/questions/1043508 ***/
user_pref("dom.disable_beforeunload", true);

/*** 2300: SERVICE WORKERS ***/
user_pref("ghacks_user.js.parrot", "2300 syntax error: the parrot's off the twig!");
/* 2301: disable workers API and service workers API
 * [NOTE] CVE-2016-5259, CVE-2016-2812, CVE-2016-1949, CVE-2016-5287 (fixed)
 * [WARNING] WILL break sites especially workers eg Google Street View
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * [2] https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker_API
 * [3] http://www.ghacks.net/2016/03/02/manage-service-workers-in-firefox-and-chrome/ ***/
user_pref("dom.workers.enabled", false);
user_pref("dom.serviceWorkers.enabled", false);
/* 2302: disable service workers cache and cache storage ***/
user_pref("dom.caches.enabled", false);
/* 2303: disable push notifications (FF44+) [requires serviceWorkers to be enabled]
 * web apps can receive messages pushed to them from a server, whether or
 * not the web app is in the foreground, or even currently loaded
 * [WARNING] may affect social media sites like Twitter
 * [1] https://developer.mozilla.org/en/docs/Web/API/Push_API ***/
user_pref("dom.push.enabled", false);
user_pref("dom.push.connection.enabled", false);
user_pref("dom.push.serverURL", "");
user_pref("dom.push.userAgentID", "");
/* 2304: disable web/push notifications
 * [NOTE] you can still override individual domains under site permissions (FF44+)
 * [WARNING] may affect social media sites like Twitter
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/notification ***/
user_pref("dom.webnotifications.enabled", false);
user_pref("dom.webnotifications.serviceworker.enabled", false);

/*** 2400: DOM & JAVASCRIPT ***/
user_pref("ghacks_user.js.parrot", "2400 syntax error: the parrot's kicked the bucket!");
/* 2402: disable website access to clipboard events/content
 * [WARNING] This will break some sites functionality such as pasting into facebook, wordpress
 * this applies to onCut, onCopy, onPaste events - i.e you have to interact with
 * the website for it to look at the clipboard
 * [1] http://www.ghacks.net/2014/01/08/block-websites-reading-modifying-clipboard-contents-firefox/ ***/
user_pref("dom.event.clipboardevents.enabled", false);
/* 2403: disable clipboard commands (cut/copy) from "non-privileged" content
 * this disables document.execCommand("cut"/"copy") to protect your clipboard
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1170911 ***/
user_pref("dom.allow_cut_copy", false); // (hidden pref)
/* 2404: disable JS storing data permanently
 * If you block indexedDB but would like a toggle button, try the following add-on
 * This setting WAS under about:permissions>All Sites>Maintain Offline Storage
 * [NOTE] about:permissions is no longer available since FF46 but you can still override
 * individual domains: use info icon in urlbar etc or right click on a web page>view page info
 * [WARNING] [SETUP] If set as false (disabled), this WILL break some [old] add-ons and DOES
 * break a lot of sites' functionality. Applies to websites, add-ons and session data.
 * [1] https://addons.mozilla.org/en-US/firefox/addon/disable-indexeddb/ ***/
user_pref("dom.indexedDB.enabled", false);
/* 2410: disable User Timing API
 * [1] https://trac.torproject.org/projects/tor/ticket/16336 ***/
user_pref("dom.enable_user_timing", false);
/* 2411: disable resource/navigation timing ***/
user_pref("dom.enable_resource_timing", false);
/* 2412: disable timing attacks - javascript performance fingerprinting
 * [1] https://wiki.mozilla.org/Security/Reviews/Firefox/NavigationTimingAPI ***/
user_pref("dom.enable_performance", false);
/* 2414: disable shaking the screen ***/
user_pref("dom.vibrator.enabled", false);
/* 2415: max popups from a single non-click event - default is 20! ***/
user_pref("dom.popup_maximum", 3);
/* 2415b: limit events that can cause a popup
 * default is "change click dblclick mouseup notificationclick reset submit touchend"
 * [1] http://kb.mozillazine.org/Dom.popup_allowed_events ***/
user_pref("dom.popup_allowed_events", "click dblclick");
/* 2416: disable idle observation ***/
user_pref("dom.idle-observers-api.enabled", false);
/* 2418: disable full-screen API
 * This setting WAS under about:permissions>All Sites>Fullscreen
 * [NOTE] about:permissions is no longer available since FF46 but you can still override
 * individual domains: use info icon in urlbar etc or right click on a web page>view page info
 * set to false=block, set to true=ask ***/
user_pref("full-screen-api.enabled", false);
/* 2420: disable support for asm.js ( http://asmjs.org/ )
 * [1] https://www.mozilla.org/en-US/security/advisories/mfsa2015-29/
 * [2] https://www.mozilla.org/en-US/security/advisories/mfsa2015-50/
 * [3] https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-2712 ***/
user_pref("javascript.options.asmjs", false);
/* 2421: in addition to 2420, these settings will help harden JS against exploits such as CVE-2015-0817
 * [WARNING] causes the odd site issue and there is also a performance loss
 * [1] https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-0817 ***/
   // user_pref("javascript.options.ion", false);
   // user_pref("javascript.options.baselinejit", false);
/* 2422: disable WebAssembly for now (FF52+)
 * [1] https://developer.mozilla.org/en-US/docs/WebAssembly ***/
user_pref("javascript.options.wasm", false);
/* 2425: disable ArchiveAPI i.e reading content of archives, such as zip files, directly
 * in the browser, through DOM file objects. Default is false. ***/
user_pref("dom.archivereader.enabled", false);
/* 2450a: force Firefox to tell you if a website asks to store data for offline use
 * [1] https://support.mozilla.org/en-US/questions/1098540
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=959985 ***/
user_pref("offline-apps.allow_by_default", false);
/* 2450b: display a notification when websites offer data for offline use
 * [SETTING] Options>Advanced>Network>Tell me when a website asks to store data for offline use ***/
user_pref("browser.offline-apps.notify", true);
/* 2450c: change size of warning quota for offline cache (default 51200)
 * Offline cache is only used in rare cases to store data locally. FF will store small amounts
 * (default <50MB) of data in the offline (application) cache without asking for permission. ***/
   // user_pref("offline-apps.quota.warn", 51200);

/*** 2500: HARDWARE FINGERPRINTING ***/
user_pref("ghacks_user.js.parrot", "2500 syntax error: the parrot's shuffled off 'is mortal coil!");
/* 2501: disable gamepad API - USB device ID enumeration
 * [1] https://trac.torproject.org/projects/tor/ticket/13023 ***/
user_pref("dom.gamepad.enabled", false);
/* 2503: disable giving away network info
 * eg bluetooth, cellular, ethernet, wifi, wimax, other, mixed, unknown, none
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
 * [2] https://wicg.github.io/netinfo/
 * [3] https://bugzilla.mozilla.org/show_bug.cgi?id=960426 ***/
user_pref("dom.netinfo.enabled", false);
/* 2504: disable virtual reality devices
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API ***/
user_pref("dom.vr.enabled", false);
user_pref("dom.vr.oculus.enabled", false);
user_pref("dom.vr.osvr.enabled", false); // (FF49+)
user_pref("dom.vr.openvr.enabled", false); // (FF51+)
/* 2505: disable media device enumeration (FF29+)
 * [NOTE] media.peerconnection.enabled should also be set to false (see 2001)
 * [1] https://wiki.mozilla.org/Media/getUserMedia
 * [2] https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices ***/
user_pref("media.navigator.enabled", false);
/* 2506: disable video statistics - JS performance fingerprinting
 * [1] https://trac.torproject.org/projects/tor/ticket/15757 ***/
user_pref("media.video_stats.enabled", false);
/* 2507: disable keyboard fingerprinting (FF38+) (physical keyboards)
 * The Keyboard API allows tracking the "read parameter" of pressed keys in forms on
 * web pages. These parameters vary between types of keyboard layouts such as QWERTY,
 * AZERTY, Dvorak, and between various languages, eg German vs English.
 * [WARNING] Don't use if Android + physical keyboard
 * [UPDATE] This MAY be incorporated better under privacy.resistFingerprinting (see 2699)
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
 * [2] https://www.privacy-handbuch.de/handbuch_21v.htm ***/
user_pref("dom.keyboardevent.code.enabled", false);
user_pref("dom.keyboardevent.dispatch_during_composition", false);
/* 2508: disable hardware acceleration to reduce graphics fingerprinting
 * [SETTING] Options>Advanced>General>Use hardware acceleration when available
 * [NOTE] changing this option changes BOTH these preferences
 * [WARNING] [SETUP] Affects text rendering (fonts will look different) and impacts video performance
 * [1] https://wiki.mozilla.org/Platform/GFX/HardwareAcceleration ***/
user_pref("gfx.direct2d.disabled", true);
user_pref("layers.acceleration.disabled", true);
/* 2509: disable touch events [SETUP]
 * fingerprinting attack vector - leaks screen res & actual screen coordinates
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
 * [2] https://trac.torproject.org/projects/tor/ticket/10286 ***/
user_pref("dom.w3c_touch_events.enabled", 0);
/* 2510: disable Web Audio API (FF51+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1288359 ***/
user_pref("dom.webaudio.enabled", false);
/* 2511: disable MediaDevices change detection (FF51+) (enabled by default starting FF52+)
 * [1] https://developer.mozilla.org/en-US/docs/Web/Events/devicechange
 * [2] https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/ondevicechange ***/
user_pref("media.ondevicechange.enabled", false);
/* 2512: disable device sensor API
 * [1] https://trac.torproject.org/projects/tor/ticket/15758
 * [2] https://blog.lukaszolejnik.com/stealing-sensitive-browser-data-with-the-w3c-ambient-light-sensor-api/
 * [3] https://bugzilla.mozilla.org/show_bug.cgi?id=1357733
 * [4] https://bugzilla.mozilla.org/show_bug.cgi?id=1292751 ***/
user_pref("device.sensors.enabled", false);

/*** 2600: MISC - LEAKS / FINGERPRINTING / PRIVACY / SECURITY ***/
user_pref("ghacks_user.js.parrot", "2600 syntax error: the parrot's run down the curtain!");
/* 2601: disable sending additional analytics to web servers
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon ***/
user_pref("beacon.enabled", false);
/* 2602: CIS 2.3.2 disable downloading on desktop ***/
user_pref("browser.download.folderList", 2);
/* 2603: always ask the user where to download - enforce user interaction for security ***/
user_pref("browser.download.useDownloadDir", false);
/* 2604: https://bugzilla.mozilla.org/show_bug.cgi?id=238789#c19 ***/
user_pref("browser.helperApps.deleteTempFileOnExit", true);
/* 2605: don't integrate activity into windows recent documents ***/
user_pref("browser.download.manager.addToRecentDocs", false);
/* 2606: disable hiding mime types (Options>Applications) not associated with a plugin ***/
user_pref("browser.download.hide_plugins_without_extensions", false);
/* 2607: disable page thumbnail collection
 * look in profile/thumbnails directory - you may want to clean that out ***/
user_pref("browser.pagethumbnails.capturing_disabled", true); // (hidden pref)
/* 2608: disable JAR from opening Unsafe File Types ***/
user_pref("network.jar.open-unsafe-types", false);
/* 2611: disable WebIDE to prevent remote debugging and add-on downloads
 * [1] https://trac.torproject.org/projects/tor/ticket/16222 ***/
user_pref("devtools.webide.autoinstallADBHelper", false);
user_pref("devtools.webide.autoinstallFxdtAdapters", false);
user_pref("devtools.debugger.remote-enabled", false);
user_pref("devtools.webide.enabled", false);
/* 2612: disable SimpleServiceDiscovery - which can bypass proxy settings - eg Roku
 * [1] https://trac.torproject.org/projects/tor/ticket/16222 ***/
user_pref("browser.casting.enabled", false);
user_pref("gfx.layerscope.enabled", false);
/* 2614: disable SPDY as it can contain identifiers
 * [1] https://www.torproject.org/projects/torbrowser/design/#identifier-linkability (no. 10) ***/
user_pref("network.http.spdy.enabled", false);
user_pref("network.http.spdy.enabled.deps", false);
/* 2615: disable http2 for now as well ***/
user_pref("network.http.spdy.enabled.http2", false);
/* 2617: enable pdf.js as an option to preview PDFs within Firefox - EXPLOIT risk
 * Enabling this (set to true) will change your option most likely to "Ask" or "Open with
 * some external pdf reader". This does NOT necessarily prevent pdf.js being used via
 * other means, it only removes the option. We recommend this is left at default (false).
 * 1. It won't stop JS bypassing it. 2. Depending on external pdf viewers there is just as
 * much risk or more (acrobat). 3. Mozilla are very quick to patch these sorts of exploits,
 * they treat them as severe/critical and 4. for convenience
 * [SETTING] Options>Applications>Portable Document Format (PDF)
 * [SETUP] By all means, use an external app you consider MORE secure ***/
user_pref("pdfjs.disabled", false);
/* 2618: when using SOCKS have the proxy server do the DNS lookup - DNS leak issue
 * eg in TOR, this stops your local DNS server from knowing your Tor destination
 * as a remote Tor node will handle the DNS request
 * [1] http://kb.mozillazine.org/Network.proxy.socks_remote_dns
 * [2] https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO/WebBrowsers ***/
user_pref("network.proxy.socks_remote_dns", true);
/* 2619: limit HTTP redirects (this does not control redirects with HTML meta tags or JS)
 * [WARNING] a low setting of 5 or under will probably break some sites (eg gmail logins)
 * To control HTML Meta tag and JS redirects, use an add-on (eg NoRedirect). Default is 20 ***/
user_pref("network.http.redirection-limit", 10);
/* 2620: disable middle mouse click opening links from clipboard
 * [1] https://trac.torproject.org/projects/tor/ticket/10089
 * [2] http://kb.mozillazine.org/Middlemouse.contentLoadURL ***/
user_pref("middlemouse.contentLoadURL", false);
/* 2621: disable IPv6 (included for knowledge ONLY [WARNING] do not do this)
 * This is all about covert channels such as MAC addresses being included/abused in the
 * IPv6 protocol for tracking. If you want to mask your IP address, this is not the way
 * to do it. It's 2016, IPv6 is here. Here are some old links
 * 2010: https://www.christopher-parsons.com/ipv6-and-the-future-of-privacy/
 * 2011: https://iapp.org/news/a/2011-09-09-facing-the-privacy-implications-of-ipv6
 * 2012: http://www.zdnet.com/article/security-versus-privacy-with-ipv6-deployment/
 * [NOTE] It is a myth that disabling IPv6 will speed up your internet connection
 * [1] http://www.howtogeek.com/195062/no-disabling-ipv6-probably-wont-speed-up-your-internet-connection ***/
   // user_pref("network.dns.disableIPv6", true);
   // user_pref("network.http.fast-fallback-to-IPv4", true);
/* 2622: ensure you have a security delay when installing add-ons (milliseconds)
 * default=1000, This also covers the delay in "Save" on downloading files.
 * [1] http://kb.mozillazine.org/Disable_extension_install_delay_-_Firefox
 * [2] http://www.squarefree.com/2004/07/01/race-conditions-in-security-dialogs/ ***/
user_pref("security.dialog_enable_delay", 700);
/* 2623: ensure Strict File Origin Policy on local files
 * The default is true. Included for completeness
 * [1] http://kb.mozillazine.org/Security.fileuri.strict_origin_policy ***/
user_pref("security.fileuri.strict_origin_policy", true);
/* 2624: enforce Subresource Integrity (SRI) (FF43+)
 * The default is true. Included for completeness
 * [1] https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
 * [2] https://wiki.mozilla.org/Security/Subresource_Integrity ***/
user_pref("security.sri.enable", true);
/* 2625: Applications [non Tor protocol] SHOULD generate an error
 * upon the use of .onion and SHOULD NOT perform a DNS lookup.
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1228457 ***/
user_pref("network.dns.blockDotOnion", true);
/* 2626: strip optional user agent token, default is false, included for completeness
 * [1] https://developer.mozilla.org/en-US/docs/Web/HTTP/Gecko_user_agent_string_reference ***/
user_pref("general.useragent.compatMode.firefox", false);
/* 2628: disable UITour backend so there is no chance that a remote page can use it ***/
user_pref("browser.uitour.enabled", false);
user_pref("browser.uitour.url", "");
/* 2629: disable remote JAR files being opened, regardless of content type
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1215235 ***/
user_pref("network.jar.block-remote-files", true);
/* 2662: disable "open with" in download dialog (FF50+)
 * This is very useful to enable when the browser is sandboxed (e.g. via AppArmor)
 * in such a way that it is forbidden to run external applications.
 * [SETUP] This may interfere with some users' workflow or methods
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1281959 ***/
user_pref("browser.download.forbid_open_with", true);
/* 2663: disable MathML (Mathematical Markup Language) (FF51+)
 * [TEST] http://browserspy.dk/mathml.php
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1173199 ***/
user_pref("mathml.disabled", true);
/* 2664: disable DeviceStorage API
 * [1] https://wiki.mozilla.org/WebAPI/DeviceStorageAPI ***/
user_pref("device.storage.enabled", false);
/* 2665: sanitize webchannel whitelist ***/
user_pref("webchannel.allowObject.urlWhitelist", "");
/* 2666: disable HTTP Alternative Services
 * [1] http://www.ghacks.net/2015/08/18/a-comprehensive-list-of-firefox-privacy-and-security-settings/#comment-3970881 ***/
user_pref("network.http.altsvc.enabled", false);
user_pref("network.http.altsvc.oe", false);
/* 2667: disable various developer tools in browser context
 * [SETTING] Devtools>Advanced Settings>Enable browser chrome and add-on debugging toolboxes
 * [1] http://github.com/pyllyukko/user.js/issues/179#issuecomment-246468676 ***/
user_pref("devtools.chrome.enabled", false);
/* 2668: lock down allowed extension directories
 * [WARNING] this will break add-ons that do not use the default XPI directories
 * [1] https://mike.kaply.com/2012/02/21/understanding-add-on-scopes/
 * [2] archived: http://archive.is/DYjAM ***/
user_pref("extensions.enabledScopes", 1); // (hidden pref)
user_pref("extensions.autoDisableScopes", 15);
/* 2669: strip paths when sending URLs to PAC scripts (FF51+)
 * CVE-2017-5384: Information disclosure via Proxy Auto-Config (PAC)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1255474 ***/
user_pref("network.proxy.autoconfig_url.include_path", false);
/* 2670: close bypassing of CSP via image mime types (FF51+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1288361 ***/
user_pref("security.block_script_with_wrong_mime", true);
/* 2671: disable in-content SVG (Scalable Vector Graphics) (FF53+)
 * [WARNING] SVG is fairly common (~15% of the top 10K sites), so will cause some breakage
 * including youtube player controls. Best left for "hardened" or specific profiles.
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1216893 ***/
   // user_pref("svg.disabled", true);
/* 2672: force Punycode for Internationalized Domain Names to eliminate possible spoofing security risk
 * Firefox has *some* protections to mitigate the risk, but it is better to be safe
 * than sorry. The downside: it will also display legitimate IDN's punycoded, which
 * might be undesirable for users from countries with non-latin alphabets
 * [1] http://kb.mozillazine.org/Network.IDN_show_punycode
 * [2] https://wiki.mozilla.org/IDN_Display_Algorithm
 * [3] https://en.wikipedia.org/wiki/IDN_homograph_attack
 * [4] CVE-2017-5383: https://www.mozilla.org/en-US/security/advisories/mfsa2017-02/ ***/
user_pref("network.IDN_show_punycode", true);
/* 2673: enforce CSP (Content Security Policy) (default is true)
 * [1] https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP ***/
user_pref("security.csp.enable", true);
/* 2674: enable CSP 1.1 experimental hash-source directive (FF29+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=855326
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=883975 ***/
user_pref("security.csp.experimentalEnabled", true);

/*** 2697: USER AGENT (UA) SPOOFING
     Spoofing your UA to *LOWER* entropy *does* *not* *work*. It may even cause site breakage
     depending on your values. Even if you spoof, like TBB (Tor Browser Bundle) does, as the
     latest ESR, it still *does* *not* *work*. There are two main reasons for this.
       1. Many of the components that make up your UA can be derived by other means. And when
          those values differ, you provide more bits and raise entropy. Examples of leaks include
          navigator objects, resource://URIs, <isindex> locale, feature detection and more.
       2. You are not in a controlled set of significant numbers, where the values are enforced
          by default. It works for TBB because for TBB, the spoofed values ARE their default.
     * We do not recommend UA spoofing yourself, leave it to privacy.resistFingerprinting (see 2699)
     * Values below are for example only based on the current ESR/TBB at the time of writing
***/
/* 2697a: navigator.userAgent leaks in JS
 * [NOTE] setting this will break any UA spoofing add-on whitelisting ***/
   // user_pref("general.useragent.override", "Mozilla/5.0 (Windows NT 6.1; rv:45.0) Gecko/20100101 Firefox/45.0"); // (hidden pref)
/* 2697b: navigator.buildID (see gecko.buildID in about:config) reveals build time
 * down to the second which defeats user agent spoofing and can compromise OS etc
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=583181 ***/
   // user_pref("general.buildID.override", "20100101"); // (hidden pref)
/* 2697c: navigator.appName ***/
   //user_pref("general.appname.override", "Netscape"); // (hidden pref)
/* 2697d: navigator.appVersion ***/
   // user_pref("general.appversion.override", "5.0 (Windows)"); // (hidden pref)
/* 2697e: navigator.platform leaks in JS ***/
   // user_pref("general.platform.override", "Win32"); // (hidden pref)
/* 2697f: navigator.oscpu leaks in JS ***/
   // user_pref("general.oscpu.override", "Windows NT 6.1"); // (hidden pref)
/* 2697g: also see 0204 for general.useragent.locale ***/

/*** 2698: FIRST PARTY ISOLATION (FPI) ***/
/* 2698a: enable first party isolation pref and OriginAttribute (FF51+)
 * [WARNING] breaks lots of cross-domain logins and site functionality until perfected
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1260931 ***/
/* 2698b: isolate favicons (FF52+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1277803 ***/
/* 2698c: isolate OCSP cache (FF52+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1264562 ***/
/* 2698d: isolate Shared Workers (FF52+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1268726 ***/
/* 2698e: isolate SSL session cache (FF52+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1316283 ***/
/* 2698f: isolate media cache (FF53+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1317927 ***/
/* 2698g: isolate HSTS and HPKP (FF54+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1323644 ***/
/* 2698h: isolate HTTP Alternative Services (FF54+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1334690 ***/
/* 2698i: isolate SPDY/HTTP2 (FF55+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1334693 ***/
/* 2698j: isolate DNS cache (FF55+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1337893 ***/
   // user_pref("privacy.firstparty.isolate", true);

/*** 2699: TOR UPLIFT: privacy.resistFingerprinting
     This preference will be used as a generic switch for a wide range of items.
     This section will attempt to list all the ramifications and Mozilla tickets ***/
/* 2699a: limit window.screen & CSS media queries providing large amounts of identifiable info.
 * POC: http://ip-check.info/?lang=en (screen, usable screen, and browser window will match)
 * [NOTE] does not cover everything yet - https://bugzilla.mozilla.org/show_bug.cgi?id=1216800
 * [NOTE] this will probably make your values pretty unique until you resize or snap the
 * inner window width + height into standard/common resolutions (mine is at 1366x768)
 * To set a size, open a XUL (chrome) page (such as about:config) which is at 100% zoom, hit
 * Shift+F4 to open the scratchpad, type window.resizeTo(1366,768), hit Ctrl+R to run. Test
 * your window size, do some math, resize to allow for all the non inner window elements
 * [TEST] http://browserspy.dk/screen.php
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=418986 ***/
/* 2699b: spoof screen orientation
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1281949 ***/
/* 2699c: hide the contents of navigator.plugins and navigator.mimeTypes (FF50+)
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1281963 ***/
user_pref("privacy.resistFingerprinting", true); // (hidden pref)

/*** 2700: COOKIES & DOM STORAGE ***/
user_pref("ghacks_user.js.parrot", "2700 syntax error: the parrot's joined the bleedin' choir invisible!");
/* 2701: disable cookies on all sites [SETUP]
 * You can set exceptions under site permissions or use an extension (eg Cookie Controller)
 * 0=allow all 1=allow same host 2=disallow all 3=allow 3rd party if it already set a cookie
 * [SETTING] Options>Privacy>History>Custom Settings>Accept cookies from sites ***/
user_pref("network.cookie.cookieBehavior", 2);
/* 2702: ensure that third-party cookies (if enabled, see above pref) are session-only
 * [1] https://feeding.cloud.geek.nz/posts/tweaking-cookies-for-privacy-in-firefox/
 * [2] http://kb.mozillazine.org/Network.cookie.thirdparty.sessionOnly ***/
user_pref("network.cookie.thirdparty.sessionOnly", true);
/* 2703: set cookie lifetime policy
 * 0=until they expire (default), 2=until you close Firefox, 3=for n days (see next pref)
 * [SETTING] Options>Privacy>History>Custom Settings>Accept cookies from sites>Keep until ***/
   // user_pref("network.cookie.lifetimePolicy", 0);
/* 2704: set cookie lifetime in days (see above pref) - default is 90 days ***/
   // user_pref("network.cookie.lifetime.days", 90);
/* 2705: disable dom storage
 * [WARNING] this will break a LOT of sites' functionality.
 * You are better off using an extension for more granular control ***/
   // user_pref("dom.storage.enabled", false);
/* 2706: disable Storage API (FF51+)
 * The API gives sites the ability to find out how much space they can use, how much
 * they are already using, and even control whether or not they need to be alerted
 * before the user agent disposes of site data in order to make room for other things.
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/StorageManager
 * [2] https://developer.mozilla.org/en-US/docs/Web/API/Storage_API ***/
user_pref("dom.storageManager.enabled", false);
/* 2707: clear localStorage and UUID when a WebExtension is uninstalled
 * [NOTE] both preferences must be the same
 * [1] https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1213990 ***/
user_pref("extensions.webextensions.keepStorageOnUninstall", false);
user_pref("extensions.webextensions.keepUuidOnUninstall", false);
/* 2708: prevent HTTP sites from setting cookies with the "secure" directive (default: true) (FF52+)
 * [1] https://developer.mozilla.org/en-US/Firefox/Releases/52#HTTP ***/
user_pref("network.cookie.leave-secure-alone", true);

/*** 2800: SHUTDOWN [SETUP]
     You should set the values to what suits you best. Be aware that the settings below clear
     browsing, download and form history, but not cookies (we expect you to use an extension).
     [NOTE] In both 2803 + 2804, the 'download' and 'history' prefs are combined in the
     firefox interface as "Browsing & Download History" and their values will be synced
 ***/
user_pref("ghacks_user.js.parrot", "2800 syntax error: the parrot's bleedin' demised!");
/* 2802: enable Firefox to clear history items on shutdown
 * [SETTING] Options>Privacy>Clear history when Firefox closes ***/
user_pref("privacy.sanitize.sanitizeOnShutdown", true);
/* 2803: set what history items to clear on shutdown
 * [SETTING] Options>Privacy>Clear history when Firefox closes>Settings
 * [NOTE] If 'history' is true, downloads will also be cleared regardless of the value
 * but if 'history' is false, downloads can still be cleared independently
 * However, this may not always be the case. The interface combines and syncs these
 * prefs when set from there, and the sanitize code may change at any time ***/
user_pref("privacy.clearOnShutdown.cache", true);
user_pref("privacy.clearOnShutdown.cookies", false);
user_pref("privacy.clearOnShutdown.downloads", true); // see note above
user_pref("privacy.clearOnShutdown.formdata", true); // Form & Search History
user_pref("privacy.clearOnShutdown.history", true); // Browsing & Download History
user_pref("privacy.clearOnShutdown.offlineApps", true); // Offline Website Data
user_pref("privacy.clearOnShutdown.sessions", true); // Active Logins
user_pref("privacy.clearOnShutdown.siteSettings", false); // Site Preferences
/* 2804: set what history items to clear with Ctrl-Shift-Del (to match above)
 * This dialog can also be accessed from the menu History>Clear Recent History
 * [NOTE] regardless of what you set privacy.cpd.downloads to, as soon as the dialog
 * for "Clear Recent History" is opened, it is synced to the same as 'history' ***/
user_pref("privacy.cpd.cache", true);
user_pref("privacy.cpd.cookies", false);
   // user_pref("privacy.cpd.downloads", true); // not used, see note above
user_pref("privacy.cpd.formdata", true); // Form & Search History
user_pref("privacy.cpd.history", true); // Browsing & Download History
user_pref("privacy.cpd.offlineApps", true); // Offline Website Data
user_pref("privacy.cpd.passwords", false); // this is not listed
user_pref("privacy.cpd.sessions", true); // Active Logins
user_pref("privacy.cpd.siteSettings", false); // Site Preferences
/* 2805: privacy.*.openWindows (FF34+)
 * We don't know what they do because we don't care what they do ***/
user_pref("privacy.clearOnShutdown.openWindows", false);
user_pref("privacy.cpd.openWindows", false);
/* 2806: reset default 'Time range to clear' for 'Clear Recent History' (see 2804)
 * Firefox remembers your last choice. This will reset the value when you start Firefox.
 * 0=everything, 1=last hour, 2=last two hours, 3=last four hours
 * 4=today, 5=last five minutes, 6=last twenty-four hours
 * [NOTE] The values 5 + 6 are not listed in the dropdown, which will display a
 * blank value if they are used, but they do work as advertised ***/
user_pref("privacy.sanitize.timeSpan", 0);

/*** 3000: PERSONAL SETTINGS [SETUP]
     Settings that are handy to migrate and/or are not in the Options interface. Users
     can put their own non-security/privacy/fingerprinting/tracking stuff here ***/
user_pref("ghacks_user.js.parrot", "3000 syntax error: this is an ex-parrot!");
/* 3001: disable annoying warnings ***/
user_pref("general.warnOnAboutConfig", false);
user_pref("browser.tabs.warnOnClose", false);
user_pref("browser.tabs.warnOnCloseOtherTabs", false);
user_pref("browser.tabs.warnOnOpen", false);
/* 3001a: disable warning when a domain requests full screen
 * [1] https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode ***/
   // user_pref("full-screen-api.warning.delay", 0);
   // user_pref("full-screen-api.warning.timeout", 0);
/* 3002: disable closing browser with last tab ***/
user_pref("browser.tabs.closeWindowWithLastTab", false);
/* 3004: disable backspace (0 = previous page, 1 = scroll up, 2 = do nothing) ***/
user_pref("browser.backspace_action", 2);
/* 3005: disable autocopy default (linux) ***/
   // user_pref("clipboard.autocopy", false);
/* 3007: open new windows in a new tab instead
 * 1=current window, 2=new window, 3=most recent window
 * [SETTING] Options>General>Tabs>Open new windows in a new tab instead ***/
user_pref("browser.link.open_newwindow", 3);
/* 3009: turn on APZ (Async Pan/Zoom) - requires e10s
 * [1] http://www.ghacks.net/2015/07/28/scrolling-in-firefox-to-get-a-lot-better-thanks-to-apz/ ***/
   // user_pref("layers.async-pan-zoom.enabled", true);
/* 3010: enable ctrl-tab previews ***/
user_pref("browser.ctrlTab.previews", true);
/* 3011: don't open "page/selection source" in a tab. The window used instead is cleaner
 * and easier to use and move around (eg developers/multi-screen). ***/
user_pref("view_source.tab", false);
/* 3012: spellchecking: 0=none, 1-multi-line controls, 2=multi-line & single-line controls ***/
user_pref("layout.spellcheckDefault", 1);
/* 3013: disable automatic "Work Offline" status
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=620472
 * [2] https://developer.mozilla.org/en-US/docs/Online_and_offline_events ***/
user_pref("network.manage-offline-status", false);
/* 3015: disable tab animation, speed things up a little ***/
user_pref("browser.tabs.animate", false);
/* 3016: disable fullscreeen animation. Test using F11.
 * Animation is smother but is annoyingly slow, while no animation can be startling ***/
user_pref("browser.fullscreen.animate", false);
/* 3017: submenu in milliseconds. 0=instant while a small number allows
 * a mouse pass over menu items without any submenus alarmingly shooting out ***/
user_pref("ui.submenuDelay", 150); // (hidden pref)
/* 3018: maximum number of daily bookmark backups to keep (default is 15) ***/
user_pref("browser.bookmarks.max_backups", 2);
/* 3020: FYI: urlbar click behaviour (with defaults) ***/
user_pref("browser.urlbar.clickSelectsAll", true);
user_pref("browser.urlbar.doubleClickSelectsAll", false);
/* 3021a: FYI: tab behaviours (with defaults)
 * open links in a new tab immediately to the right of parent tab, not far right ***/
user_pref("browser.tabs.insertRelatedAfterCurrent", true);
/* 3021b: switch to the parent tab (if it has one) on close, rather than
 * to the adjacent right tab if it exists or to the adjacent left tab if it doesn't.
 * [NOTE] requires browser.link.open_newwindow set to 3 (see pref 3007) ***/
user_pref("browser.tabs.selectOwnerOnClose", true);
/* 3021c: stay on the parent tab when opening links in a new tab
 * [SETTING] Options>General>Tabs>When I open a link in a new tab, switch to it immediately ***/
user_pref("browser.tabs.loadInBackground", true);
/* 3021d: set behavior of pages normally meant to open in a new window (such as target="_blank"
 * or from an external program), but that have instead been loaded in a new tab.
 * true: load the new tab in the background, leaving focus on the current tab
 * false: load the new tab in the foreground, taking the focus from the current tab. ***/
user_pref("browser.tabs.loadDivertedInBackground", false);
/* 3022: hide recently bookmarked items (you still have the original bookmarks) (FF49+) ***/
user_pref("browser.bookmarks.showRecentlyBookmarked", false);
/* 3023: disable automigrate (FF49+)
 * default is false in FF49+
 * need more info, but lock down for now ***/
user_pref("browser.migrate.automigrate.enabled", false);
/* 3024: enable "Find As You Type"
 * [1] http://kb.mozillazine.org/Accessibility.typeaheadfind ***/
   // user_pref("accessibility.typeaheadfind", true);
/* 3025: enable/disable various media types ***/
   // user_pref("media.mp4.enabled", false);
   // user_pref("media.flac.enabled", false); // (FF51+)
   // user_pref("media.ogg.enabled", false);
   // user_pref("media.ogg.flac.enabled", false); // (FF51+)
   // user_pref("media.opus.enabled", false);
   // user_pref("media.raw.enabled", false);
   // user_pref("media.wave.enabled", false);
   // user_pref("media.webm.enabled", false);
   // user_pref("media.wmf.enabled", false); // https://www.youtube.com/html5 - for the two H.264 entries
/* 3026: disable "Reader View" ***/
   // user_pref("reader.parse-on-load.enabled", false);

/* END: internal custom pref to test for syntax errors ***/
user_pref("ghacks_user.js.parrot", "No no he's not dead, he's, he's restin'! Remarkable bird, the Norwegian Blue");

/*** 9997: DEPRECATED / REMOVED
     Personally confirmed by resetting as well as via documentation and DXR searches.
     [NOTE] numbers may get re-used ***/
/* 2607: (23+) disable page thumbnails, it was around v23, not 100% sure when
 * this pref was replaced with browser.pagethumbnails.capturing_disabled ***/
   // user_pref("pageThumbs.enabled", false);
/* 2408: (31+) disable network API - fingerprinting vector ***/
   // user_pref("dom.network.enabled", false);
/* 2620: (35+) disable WebSockets
 * [1] https://developer.mozilla.org/en-US/Firefox/Releases/35 ***/
   // user_pref("network.websocket.enabled", false);
/* 2023: (37+) disable camera autofocus callback (was in 36, not in 37)
 * Not part of any specification, the API will be superceded by the WebRTC Capture
 * and Stream API ( http://w3c.github.io/mediacapture-main/getusermedia.html )
 * [1] https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/API/CameraControl/ ***/
   // user_pref("camera.control.autofocus_moving_callback.enabled", false);
/* 1804: (41+) disable plugin enumeration ***/
   // user_pref("plugins.enumerable_names", "");
/* 0420: (42+) disable tracking protection
 * this particular pref was never in stable
 * labelled v42+ because that's when tracking protection landed ***/
   // user_pref("browser.polaris.enabled", false);
/* 2803: (42+) what to clear on shutdown
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1102184#c23 ***/
   // user_pref("privacy.clearOnShutdown.passwords", false);
/* 0411: (43+) disable safebrowsing urls & download ***/
   // user_pref("browser.safebrowsing.gethashURL", "");
   // user_pref("browser.safebrowsing.malware.reportURL", "");
   // user_pref("browser.safebrowsing.provider.google.appRepURL", "");
   // user_pref("browser.safebrowsing.reportErrorURL", "");
   // user_pref("browser.safebrowsing.reportGenericURL", "");
   // user_pref("browser.safebrowsing.reportMalwareErrorURL", "");
   // user_pref("browser.safebrowsing.reportMalwareURL", "");
   // user_pref("browser.safebrowsing.reportURL", "");
   // user_pref("browser.safebrowsing.updateURL", "");
/* 0420: (43+) disable tracking protection. FF43+ URLs are now part of safebrowsing
 * [1] https://wiki.mozilla.org/Security/Tracking_protection (look under Prefs)
 * [NOTE] getupdateURL = WRONG / never existed. updateURL = CORRECT and has been added FYI ***/
   // user_pref("browser.trackingprotection.gethashURL", "");
   // user_pref("browser.trackingprotection.getupdateURL", "");
   // user_pref("browser.trackingprotection.updateURL", "");
/* 1803: (43+) remove plugin finder service
 * [1] http://kb.mozillazine.org/Pfs.datasource.url ***/
   // user_pref("pfs.datasource.url", "");
/* 2403: (43+) disable scripts changing images
 * [TEST] http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_img_src2
 * [WARNING] will break some sites such as Google Maps and a lot of web apps ***/
   // user_pref("dom.disable_image_src_set", true);
/* 2615: (43+) disable http2 for now as well ***/
   // user_pref("network.http.spdy.enabled.http2draft", false);
/* 3001a: (43+) disable warning when a domain requests full screen
 * replaced by setting full-screen-api.warning.timeout to zero ***/
   // user_pref("full-screen-api.approval-required", false);
/* 3003: (43+) disable new search panel UI [Classic Theme Restorer can restore the old search] ***/
   // user_pref("browser.search.showOneOffButtons", false);
/* 1201: (44+) block rc4 whitelist
 * [1] https://developer.mozilla.org/en-US/Firefox/Releases/44#Security ***/
   // user_pref("security.tls.insecure_fallback_hosts.use_static_list", false);
/* 2417: (44+) disable SharedWorkers, which allow the exchange of data between iFrames that
 * are open in different tabs, even if the sites do not belong to the same domain.
 * [1] https://www.torproject.org/projects/torbrowser/design/#identifier-linkability (no. 8)
 * [2] https://bugs.torproject.org/15562
 * is used in FF 45 and 46 code once, to set it for a test ***/
   // user_pref("dom.workers.sharedWorkers.enabled", false);
/* 1005: (45+) disable deferred level of storing extra session data 0=all 1=http-only 2=none ***/
   // user_pref("browser.sessionstore.privacy_level_deferred", 2);
/* 0334b: (46+) disable FHR (Firefox Health Report) v2 data being sent to Mozilla servers ***/
   // user_pref("datareporting.policy.dataSubmissionEnabled.v2", false);
/* 0373: (46+) disable "Pocket". FF46 replaced these with extensions.pocket.* ***/
   // user_pref("browser.pocket.enabled", false);
   // user_pref("browser.pocket.api", "");
   // user_pref("browser.pocket.site", "");
   // user_pref("browser.pocket.oAuthConsumerKey", "");
/* 0410e: (46+) safebrowsing ***/
   // user_pref("browser.safebrowsing.appRepURL", ""); // Google application reputation check
/* 0333b: (47+) disable about:healthreport page UNIFIED ***/
   // user_pref("datareporting.healthreport.about.reportUrlUnified", "data:text/plain,");
/* 0807: (47+) disable history manipulation
 * [1] https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history
 * [WARNING] if set to false it breaks some sites (youtube) ability to correctly show the
 * url in location bar and for the forward/back tab history to work ***/
   // user_pref("browser.history.allowPopState", false);
   // user_pref("browser.history.allowPushState", false);
   // user_pref("browser.history.allowReplaceState", false);
/* (48+) disable dom.mozTCPSocket.enabled (raw TCP socket support)
 * [1] https://trac.torproject.org/projects/tor/ticket/18863
 * [2] https://www.mozilla.org/en-US/security/advisories/mfsa2015-97/
 * [3] https://developer.mozilla.org/docs/Mozilla/B2G_OS/API/TCPSocket ***/
   // user_pref("dom.mozTCPSocket.enabled", false);
/* 0806: (48+) disable 'unified complete': 'Search with [default search engine]'
 * this feature has been added back in Classic Theme Restorer
 * [1] http://techdows.com/2016/05/firefox-unified-complete-aboutconfig-preference-removed.html ***/
   // user_pref("browser.urlbar.unifiedcomplete", false);
/* 3006: (48+) disable enforced add-on signing
 * [NOTE] the preference is still in FF48+, but it's legacy code and does not work in stable ***/
   // user_pref("xpinstall.signatures.required", false);
/* 0372: (49+) disable "Hello" (TokBox/Telefonica WebRTC voice & video call PUP) WebRTC (IP leak)
 * [1] https://www.mozilla.org/en-US/privacy/firefox-hello/
 * [2] https://security.stackexchange.com/questions/94284/how-secure-is-firefox-hello
 * [3] https://support.mozilla.org/en-US/kb/hello-status ***/
   // user_pref("loop.enabled", false);
   // user_pref("loop.server", "");
   // user_pref("loop.feedback.formURL", "");
   // user_pref("loop.feedback.manualFormURL", "");
   // user_pref("loop.facebook.appId", "");
   // user_pref("loop.facebook.enabled", false);
   // user_pref("loop.facebook.fallbackUrl", "");
   // user_pref("loop.facebook.shareUrl", "");
   // user_pref("loop.logDomains", false);
/* 2202: (49+) ONE of the new window UI prefs ***/
   // user_pref("dom.disable_window_open_feature.scrollbars", true);
/* 2431: (49+) disable ONE of the push notification prefs ***/
   // user_pref("dom.push.udp.wakeupEnabled", false);
/* 0101: (50+) disable ONE of the "slow startup" options ***/
   // user_pref("browser.usedOnWindows10.introURL", "");
/* 0308: (50+) disable update plugin notifications
 * if using Flash/Java/Silverlight, it is best to turn on their own auto-update mechanisms.
 * See 1804 below: Mozilla only checks a few plugins and will soon do away with NPAPI ***/
   // user_pref("plugins.update.notifyUser", false);
/* 0410a: (50+) "Block dangerous and deceptive content" pref name change ***/
   // user_pref("browser.safebrowsing.enabled", false); // FF49 and earlier
/* 1202: (50+) disable rc4 ciphers
 * [1] https://www.fxsitecompat.com/en-CA/docs/2016/rc4-support-has-been-completely-removed/
 * [2] https://trac.torproject.org/projects/tor/ticket/17369 ***/
   // user_pref("security.ssl3.ecdhe_ecdsa_rc4_128_sha", false);
   // user_pref("security.ssl3.ecdhe_rsa_rc4_128_sha", false);
   // user_pref("security.ssl3.rsa_rc4_128_md5", false);
   // user_pref("security.ssl3.rsa_rc4_128_sha", false);
/* 1809: (50+) remove Mozilla's plugin update URL ***/
   // user_pref("plugins.update.url", "");
/* 1851: (51+) delay play of videos until they're visible
 * [1] https://bugzilla.mozilla.org/show_bug.cgi?id=1180563 ***/
   // user_pref("media.block-play-until-visible", true);
/* 2504: (51+) disable virtual reality devices ***/
   // user_pref("dom.vr.oculus050.enabled", false);
/* 2614: (51+) disable SPDY ***/
   // user_pref("network.http.spdy.enabled.v3-1", false);
/* 1602: (?) this DNT .value pref (still in code) was deprecated some time ago
 * [1] http://kb.mozillazine.org/Privacy.donottrackheader.value (pref required since FF21+) ***/
   // user_pref("privacy.donottrackheader.value", 1); // (hidden pref)
/* 1601: (52+) disable referer from an SSL Website
 * removed: https://bugzilla.mozilla.org/show_bug.cgi?id=1308725 ***/
   // user_pref("network.http.sendSecureXSiteReferrer", false);
/* 1850: (52+) disable the Adobe EME "Primetime CDM" (Content Decryption Module)
 * [1] https://trac.torproject.org/projects/tor/ticket/16285 ***/
   // user_pref("media.gmp-eme-adobe.enabled", false);
   // user_pref("media.gmp-eme-adobe.visible", false);
   // user_pref("media.gmp-eme-adobe.autoupdate", false);
/* 2405: (52+) https://wiki.mozilla.org/WebAPI/Security/WebTelephony ***/
   // user_pref("dom.telephony.enabled", false);
/* 2502: (52+) disable Battery Status API. Initially a Linux issue (high precision readout) that was fixed.
 * However, it is still another metric for fingerprinting, used to raise entropy.
 * eg: do you have a battery or not, current charging status, charge level, times remaining etc
 * [1] http://techcrunch.com/2015/08/04/battery-attributes-can-be-used-to-track-web-users/
 * [2] https://bugzilla.mozilla.org/show_bug.cgi?id=1124127
 * [3] https://www.w3.org/TR/battery-status/
 * [4] https://www.theguardian.com/technology/2016/aug/02/battery-status-indicators-tracking-online
 * [NOTE] From FF52+ Battery Status API is only available in chrome/privileged code.
 * [5] https://bugzilla.mozilla.org/show_bug.cgi?id=1313580 ***/
   // user_pref("dom.battery.enabled", false);
/* 1265: (53+) block rc4 fallback ***/
   // user_pref("security.tls.unrestricted_rc4_fallback", false);
/* 1806: (53+) disable Acrobat, Quicktime, WMP
 * The string refers to min version number allowed ***/
   // user_pref("plugin.scan.Acrobat", "99999");
   // user_pref("plugin.scan.Quicktime", "99999");
   // user_pref("plugin.scan.WindowsMediaPlayer", "99999");
/* 2022: (53+) disable screensharing ***/
   // user_pref("media.getusermedia.screensharing.allow_on_old_platforms", false);
/* 2507: (53+) disable keyboard fingerprinting ***/
   // user_pref("dom.beforeAfterKeyboardEvent.enabled", false);
