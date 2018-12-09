/******
* name: ghacks user.js
* date: 13 November 2018
* version 63-beta: Pants Romance
*   "Rah rah ah-ah-ah! Ro mah ro-mah-mah. Gaga oh-la-la! Want your pants romance"
* authors: v52+ github | v51- www.ghacks.net
* url: https://github.com/ghacksuserjs/ghacks-user.js
* license: MIT: https://github.com/ghacksuserjs/ghacks-user.js/blob/master/LICENSE.txt

* releases: These are end-of-stable-life-cycle legacy archives.
            *Always* use the master branch user.js for a current up-to-date version.
       url: https://github.com/ghacksuserjs/ghacks-user.js/releases

* README:

  0. Consider using Tor Browser if it meets your needs or fits your threat model better
     * https://www.torproject.org/about/torusers.html.en
  1. READ the full README
     * https://github.com/ghacksuserjs/ghacks-user.js/blob/master/README.md
  2. READ this
     * https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.3-Implementation
  3. If you skipped steps 1 and 2 above (shame on you), then here is the absolute minimum
     * Auto-installing updates for Firefox and extensions are disabled (section 0302's)
     * Some user data is erased on close (section 2800). Change this to suit your needs
     * EACH RELEASE check:
         - 4600s: reset prefs made redundant due to privacy.resistFingerprinting (RPF)
                  or enable them as an alternative to RFP or for ESR users
         - 9999s: reset deprecated prefs in about:config or enable relevant section(s) for ESR
     * Site breakage WILL happen
         - There are often trade-offs and conflicts between Security vs Privacy vs Anti-Fingerprinting
           and these need to be balanced against Functionality & Convenience & Breakage
     * You will need to make changes, and to troubleshoot at times (choose wisely, there is always a trade-off).
       While not 100% definitive, search for "[SETUP". If required, add each pref to your overrides section at
       default values (or comment them out and reset them in about:config). Here are the main ones:
            [SETUP-WEB] can cause some websites to break
         [SETUP-CHROME] changes how Firefox itself behaves (i.e. NOT directly website related)
           [SETUP-PERF] may impact performance
     * [WARNING] tags are extra special and used sparingly, so heed them
  4. BACKUP your profile folder before implementing (and/or test in a new/cloned profile)
  5. KEEP UP TO DATE: https://github.com/ghacksuserjs/ghacks-user.js/wiki#small_orange_diamond-maintenance

* INDEX:

     0100: STARTUP
     0200: GEOLOCATION
     0300: QUIET FOX
     0400: BLOCKLISTS / SAFE BROWSING / TRACKING PROTECTION
     0500: SYSTEM ADD-ONS / EXPERIMENTS
     0600: BLOCK IMPLICIT OUTBOUND
     0700: HTTP* / TCP/IP / DNS / PROXY / SOCKS etc
     0800: LOCATION BAR / SEARCH BAR / SUGGESTIONS / HISTORY / FORMS
     0900: PASSWORDS
     1000: CACHE
     1200: HTTPS (SSL/TLS / OCSP / CERTS / HSTS / HPKP / CIPHERS)
     1400: FONTS
     1600: HEADERS / REFERERS
     1700: CONTAINERS
     1800: PLUGINS
     2000: MEDIA / CAMERA / MIC
     2200: WINDOW MEDDLING & LEAKS / POPUPS
     2300: WEB WORKERS
     2400: DOM (DOCUMENT OBJECT MODEL) & JAVASCRIPT
     2500: HARDWARE FINGERPRINTING
     2600: MISCELLANEOUS
     2700: PERSISTENT STORAGE
     2800: SHUTDOWN
     4000: FPI (FIRST PARTY ISOLATION)
     4500: RFP (RESIST FINGERPRINTING)
     4600: RFP ALTERNATIVES
     4700: RFP ALTERNATIVES (NAVIGATOR / USER AGENT (UA) SPOOFING)
     5000: PERSONAL
     9999: DEPRECATED / REMOVED / LEGACY / RENAMED

******/

/* START: internal custom pref to test for syntax errors
 * [NOTE] In FF60+, not all syntax errors cause parsing to abort i.e. reaching the last debug
 * pref no longer necessarily means that all prefs have been applied. Check the console right
 * after startup for any warnings/error messages related to non-applied prefs
 * [1] https://blog.mozilla.org/nnethercote/2018/03/09/a-new-preferences-parser-for-firefox/ ***/
user_pref("_user.js.parrot", "START: Oh yes, the Norwegian Blue... what's wrong with it?");

/*** [SECTION 0100]: STARTUP ***/
user_pref("_user.js.parrot", "0100 syntax error: the parrot's dead!");
/* 0101: disable default browser check
 * [SETTING] General>Startup>Always check if Firefox is your default browser ***/
user_pref("browser.shell.checkDefaultBrowser", false);
/* 0102: set START page (0=blank, 1=home, 2=last visited page, 3=resume previous session)
 * [SETTING] General>Startup>Restore previous session ***/
user_pref("browser.startup.page", 0);
/* 0103: set HOME+NEWWINDOW page
 * about:home=Activity Stream (default, see 0105), custom URL, about:blank
 * [SETTING] Home>New Windows and Tabs>Homepage and new windows ***/
user_pref("browser.startup.homepage", "about:blank");
/* 0104: set NEWTAB page
 * true=Activity Stream (default, see 0105), false=blank page
 * [SETTING] Home>New Windows and Tabs>New tabs ***/
user_pref("browser.newtabpage.enabled", false);
user_pref("browser.newtab.preload", false);
/* 0105: disable Activity Stream stuff (AS)
 * AS is the default homepage/newtab in FF57+, based on metadata and browsing behavior.
 *    **NOT LISTING ALL OF THESE: USE THE PREFERENCES UI**
 * [SETTING] Home>Firefox Home Content>...  to show/hide what you want ***/
/* 0105a: disable Activity Stream telemetry ***/
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry.ping.endpoint", "");
/* 0105b: disable AS Snippets ***/
user_pref("browser.newtabpage.activity-stream.disableSnippets", true);
user_pref("browser.newtabpage.activity-stream.feeds.snippets", false); // [SETTING]
/* 0105c: disable AS Top Stories, Pocket-based and/or sponsored content ***/
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
user_pref("browser.newtabpage.activity-stream.section.highlights.includePocket", false); // [SETTING]
user_pref("browser.newtabpage.activity-stream.showSponsored", false);
/* 0105d: disable AS recent Highlights in the Library [FF57+] ***/
   // user_pref("browser.library.activity-stream.enabled", false);
/* 0110: start Firefox in PB (Private Browsing) mode
 * [NOTE] In this mode *all* windows are "private windows" and the PB mode icon is not displayed
 * [WARNING] The P in PB mode is misleading: it means no "persistent" local storage of history,
 * caches, searches or cookies (which you can achieve in normal mode). In fact, it limits or
 * removes the ability to control these, and you need to quit Firefox to clear them. PB is best
 * used as a one off window (File>New Private Window) to provide a temporary self-contained
 * new instance. Closing all Private Windows clears all traces. Repeat as required. PB also does
 * not allow indexedDB which breaks many Extensions that use it including uBlock Origin and uMatrix
 * [SETTING] Privacy & Security>History>Custom Settings>Always use private browsing mode
 * [1] https://wiki.mozilla.org/Private_Browsing ***/
   // user_pref("browser.privatebrowsing.autostart", true);

/*** [SECTION 0200]: GEOLOCATION ***/
user_pref("_user.js.parrot", "0200 syntax error: the parrot's definitely deceased!");
/* 0201: disable Location-Aware Browsing
 * [1] https://www.mozilla.org/firefox/geolocation/ ***/
   // user_pref("geo.enabled", false);
/* 0201b: set a default permission for Location [FF58+]
 * 0=always ask (default), 1=allow, 2=block
 * [NOTE] best left at default "always ask", fingerprintable via Permissions API
 * [SETTING] to add site exceptions: Page Info>Permissions>Access Your Location
 * [SETTING] to manage site exceptions: Options>Privacy & Security>Permissions>Location>Settings ***/
   // user_pref("permissions.default.geo", 2);
/* 0202: disable GeoIP-based search results
 * [NOTE] May not be hidden if Firefox has changed your settings due to your locale
 * [1] https://trac.torproject.org/projects/tor/ticket/16254
 * [2] https://support.mozilla.org/en-US/kb/how-stop-firefox-making-automatic-connections#w_geolocation-for-default-search-engine ***/
user_pref("browser.search.region", "US"); // [HIDDEN PREF]
user_pref("browser.search.geoip.url", "");
/* 0205: set OS & APP locale [FF59+]
 * If set to empty, the OS locales are used. If not set at all, default locale is used ***/
user_pref("intl.locale.requested", "en-US"); // [HIDDEN PREF]
/* 0206: disable geographically specific results/search engines e.g. "browser.search.*.US"
 * i.e. ignore all of Mozilla's various search engines in multiple locales ***/
user_pref("browser.search.geoSpecificDefaults", false);
user_pref("browser.search.geoSpecificDefaults.url", "");
/* 0207: set language to match ***/
user_pref("intl.accept_languages", "en-US, en");
/* 0208: enforce US English locale regardless of the system locale
 * [1] https://bugzilla.mozilla.org/867501 ***/
user_pref("javascript.use_us_english_locale", true); // [HIDDEN PREF]
/* 0209: use APP locale over OS locale in regional preferences [FF56+] 
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1379420,1364789 ***/
user_pref("intl.regional_prefs.use_os_locales", false);
/* 0210: use Mozilla geolocation service instead of Google when geolocation is enabled
 * Optionally enable logging to the console (defaults to false) ***/
user_pref("geo.wifi.uri", "https://location.services.mozilla.com/v1/geolocate?key=%MOZILLA_API_KEY%");
   // user_pref("geo.wifi.logging.enabled", true); // [HIDDEN PREF]

/*** [SECTION 0300]: QUIET FOX
     We choose to not disable auto-CHECKs (0301's) but to disable auto-INSTALLs (0302's).
     There are many legitimate reasons to turn off auto-INSTALLS, including hijacked or
     monetized extensions, time constraints, legacy issues, and fear of breakage/bugs.
     It is still important to do updates for security reasons, please do so manually. ***/
user_pref("_user.js.parrot", "0300 syntax error: the parrot's not pinin' for the fjords!");
/* 0301b: disable auto-update checks for extensions
 * [SETTING] about:addons>Extensions>[cog-wheel-icon]>Update Add-ons Automatically (toggle) ***/
   // user_pref("extensions.update.enabled", false);
/* 0302a: disable auto update installing for Firefox
 * [SETTING] General>Firefox Updates>Check for updates but let you choose... ***/
user_pref("app.update.auto", false);
/* 0302b: disable auto update installing for extensions (after the check in 0301b)
 * [SETTING] about:addons>Extensions>[cog-wheel-icon]>Update Add-ons Automatically (toggle) ***/
user_pref("extensions.update.autoUpdateDefault", false);
/* 0303: disable background update service [WINDOWS]
 * [SETTING] General>Firefox Updates>Use a background service to install updates ***/
user_pref("app.update.service.enabled", false);
/* 0304: disable background update staging ***/
user_pref("app.update.staging.enabled", false);
/* 0305: enforce update information is displayed
 * This is the update available, downloaded, error and success information ***/
user_pref("app.update.silent", false);
/* 0306: disable extension metadata updating
 * sends daily pings to Mozilla about extensions and recent startups ***/
user_pref("extensions.getAddons.cache.enabled", false);
/* 0307: disable auto updating of personas (themes) ***/
user_pref("lightweightThemes.update.enabled", false);
/* 0308: disable search update
 * [SETTING] General>Firefox Updates>Automatically update search engines ***/
user_pref("browser.search.update", false);
/* 0309: disable sending Flash crash reports ***/
user_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled", false);
/* 0310: disable sending the URL of the website where a plugin crashed ***/
user_pref("dom.ipc.plugins.reportCrashURL", false);
/* 0320: disable about:addons' Get Add-ons panel (uses Google-Analytics) ***/
user_pref("extensions.getAddons.showPane", false); // [HIDDEN PREF]
user_pref("extensions.webservice.discoverURL", "");
/* 0330: disable telemetry
 * the pref (.unified) affects the behaviour of the pref (.enabled)
 * IF unified=false then .enabled controls the telemetry module
 * IF unified=true then .enabled ONLY controls whether to record extended data
 * so make sure to have both set as false
 * [NOTE] FF58+ `toolkit.telemetry.enabled` is now LOCKED to reflect prerelease
 * or release builds (true and false respectively), see [2]
 * [1] https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/internals/preferences.html
 * [2] https://medium.com/georg-fritzsche/data-preference-changes-in-firefox-58-2d5df9c428b5 ***/
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.enabled", false); // see [NOTE] above FF58+
user_pref("toolkit.telemetry.server", "data:,");
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("toolkit.telemetry.cachedClientID", "");
user_pref("toolkit.telemetry.newProfilePing.enabled", false); // [FF55+]
user_pref("toolkit.telemetry.shutdownPingSender.enabled", false); // [FF55+]
user_pref("toolkit.telemetry.updatePing.enabled", false); // [FF56+]
user_pref("toolkit.telemetry.bhrPing.enabled", false); // [FF57+] Background Hang Reporter
user_pref("toolkit.telemetry.firstShutdownPing.enabled", false); // [FF57+]
user_pref("toolkit.telemetry.hybridContent.enabled", false); // [FF59+]
/* 0333: disable health report
 * [SETTING] Privacy & Security>Firefox Data Collection & Use>Allow Firefox to send technical... data ***/
user_pref("datareporting.healthreport.uploadEnabled", false);
/* 0334: disable new data submission, master kill switch [FF41+]
 * If disabled, no policy is shown or upload takes place, ever
 * [1] https://bugzilla.mozilla.org/1195552 ***/
user_pref("datareporting.policy.dataSubmissionEnabled", false);
/* 0350: disable crash reports ***/
user_pref("breakpad.reportURL", "");
/* 0351: disable sending of crash reports ***/
user_pref("browser.tabs.crashReporting.sendReport", false); // [FF44+]
user_pref("browser.crashReports.unsubmittedCheck.enabled", false); // [FF51+]
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false); // [FF58+]
/* 0370: disable "Snippets" (Mozilla content shown on about:home screen)
 * [1] https://wiki.mozilla.org/Firefox/Projects/Firefox_Start/Snippet_Service ***/
user_pref("browser.aboutHomeSnippets.updateUrl", "data:,");
/* 0380: disable Browser Error Reporter [FF60+]
 * [1] https://support.mozilla.org/en-US/kb/firefox-nightly-error-collection
 * [2] https://firefox-source-docs.mozilla.org/browser/browser/BrowserErrorReporter.html ***/
user_pref("browser.chrome.errorReporter.enabled", false);
user_pref("browser.chrome.errorReporter.submitUrl", "");

/*** [SECTION 0400]: BLOCKLISTS / SAFE BROWSING / TRACKING PROTECTION
     This section has security & tracking protection implications vs privacy concerns vs effectiveness
     vs 3rd party 'censorship'. We DO NOT advocate no protection. If you disable Tracking Protection (TP)
     and/or Safe Browsing (SB), then SECTION 0400 REQUIRES YOU HAVE uBLOCK ORIGIN INSTALLED.

     Safe Browsing is designed to protect users from malicious sites. Tracking Protection is designed
     to lessen the impact of third parties on websites to reduce tracking and to speed up your browsing.
     These do rely on 3rd parties (Google for SB and Disconnect for TP), but many steps, which are
     continually being improved, have been taken to preserve privacy. Disable at your own risk.
***/
user_pref("_user.js.parrot", "0400 syntax error: the parrot's passed on!");
/** BLOCKLISTS ***/
/* 0401: enable Firefox blocklist, but sanitize blocklist url
 * [NOTE] It includes updates for "revoked certificates"
 * [1] https://blog.mozilla.org/security/2015/03/03/revoking-intermediate-certificates-introducing-onecrl/
 * [2] https://trac.torproject.org/projects/tor/ticket/16931 ***/
user_pref("extensions.blocklist.enabled", true); // [DEFAULT: true]
user_pref("extensions.blocklist.url", "https://blocklists.settings.services.mozilla.com/v1/blocklist/3/%APP_ID%/%APP_VERSION%/");
/* 0403: disable individual unwanted/unneeded parts of the Kinto blocklists
 * What is Kinto?: https://wiki.mozilla.org/Firefox/Kinto#Specifications
 * As Firefox transitions to Kinto, the blocklists have been broken down into entries for certs to be
 * revoked, extensions and plugins to be disabled, and gfx environments that cause problems or crashes ***/
   // user_pref("services.blocklist.onecrl.collection", ""); // revoked certificates
   // user_pref("services.blocklist.addons.collection", "");
   // user_pref("services.blocklist.plugins.collection", "");
   // user_pref("services.blocklist.gfx.collection", "");

/** SAFE BROWSING (SB)
    This sub-section has been redesigned to differentiate between "real-time"/"user initiated" data
    being sent to Google from all other settings such as using local blocklists/whitelists and updating
    those lists. There are NO privacy issues here. *IF* required, a full url is never sent to Google,
    only a PART-hash of the prefix, and this is hidden with noise of other real PART-hashes. Google also
    swear it is anonymized and only used to flag malicious sites/activity. Firefox also takes measures
    such as striping out identifying parameters and storing safe browsing cookies in a separate jar.
    SB v4 (FF57+) doesn't even use cookies. (#Turn on browser.safebrowsing.debug to monitor this activity)
    #Required reading [#] https://feeding.cloud.geek.nz/posts/how-safe-browsing-works-in-firefox/
    [1] https://wiki.mozilla.org/Security/Safe_Browsing ***/
/* 0410: disable "Block dangerous and deceptive content"
 * This covers deceptive sites such as phishing and social engineering
 * [SETTING] Privacy & Security>Security>Deceptive Content and Software Protection ***/
   // user_pref("browser.safebrowsing.malware.enabled", false);
   // user_pref("browser.safebrowsing.phishing.enabled", false); // [FF50+]
/* 0411: disable "Block dangerous downloads"
 * This covers malware and PUPs (potentially unwanted programs)
 * [SETTING] Privacy & Security>Security>Deceptive Content and Software Protection ***/
   // user_pref("browser.safebrowsing.downloads.enabled", false);
/* 0412: disable "Warn me about unwanted and uncommon software"
 * [SETTING] Privacy & Security>Security>Deceptive Content and Software Protection ***/
   // user_pref("browser.safebrowsing.downloads.remote.block_potentially_unwanted", false); // [FF48+]
   // user_pref("browser.safebrowsing.downloads.remote.block_uncommon", false); // [FF48+]
   // user_pref("browser.safebrowsing.downloads.remote.block_dangerous", false); // [FF49+]
   // user_pref("browser.safebrowsing.downloads.remote.block_dangerous_host", false); // [FF49+]
/* 0413: disable Google safebrowsing updates ***/
   // user_pref("browser.safebrowsing.provider.google.updateURL", "");
   // user_pref("browser.safebrowsing.provider.google.gethashURL", "");
   // user_pref("browser.safebrowsing.provider.google4.updateURL", ""); // [FF50+]
   // user_pref("browser.safebrowsing.provider.google4.gethashURL", ""); // [FF50+]
/* 0414: disable binaries NOT in local lists being checked by Google (real-time checking) ***/
user_pref("browser.safebrowsing.downloads.remote.enabled", false);
user_pref("browser.safebrowsing.downloads.remote.url", "");
/* 0415: disable reporting URLs ***/
user_pref("browser.safebrowsing.provider.google.reportURL", "");
user_pref("browser.safebrowsing.reportPhishURL", "");
user_pref("browser.safebrowsing.provider.google4.reportURL", ""); // [FF50+]
user_pref("browser.safebrowsing.provider.google.reportMalwareMistakeURL", ""); // [FF54+]
user_pref("browser.safebrowsing.provider.google.reportPhishMistakeURL", ""); // [FF54+]
user_pref("browser.safebrowsing.provider.google4.reportMalwareMistakeURL", ""); // [FF54+]
user_pref("browser.safebrowsing.provider.google4.reportPhishMistakeURL", ""); // [FF54+]
/* 0416: disable 'ignore this warning' on Safe Browsing warnings
 * If clicked, it bypasses the block for that session. This is a means for admins to enforce SB
 * [TEST] see github wiki APPENDIX A: Test Sites: Section 5
 * [1] https://bugzilla.mozilla.org/1226490 ***/
   // user_pref("browser.safebrowsing.allowOverride", false);
/* 0417: disable data sharing [FF58+] ***/
user_pref("browser.safebrowsing.provider.google4.dataSharing.enabled", false);
user_pref("browser.safebrowsing.provider.google4.dataSharingURL", "");

/** TRACKING PROTECTION (TP)
    There are NO privacy concerns here, but we strongly recommend to use uBlock Origin as well,
    as it offers more comprehensive and specialized lists. It also allows per domain control. ***/
/* 0420: enable Tracking Protection in all windows
 * [NOTE] TP sends DNT headers regardless of the DNT pref (see 1610)
 * [1] https://wiki.mozilla.org/Security/Tracking_protection
 * [2] https://support.mozilla.org/kb/tracking-protection-firefox ***/
   // user_pref("privacy.trackingprotection.pbmode.enabled", true); // [DEFAULT: true]
   // user_pref("privacy.trackingprotection.enabled", true);
/* 0422: set which Tracking Protection block list to use
 * [WARNING] We don't recommend enforcing this from here, as available block lists can change
 * [SETTING] Privacy & Security>Content Blocking>All Detected Trackers>Change block list ***/
   // user_pref("urlclassifier.trackingTable", "test-track-simple,base-track-digest256"); // basic
/* 0423: disable Mozilla's blocklist for known Flash tracking/fingerprinting [FF48+]
 * [1] https://www.ghacks.net/2016/07/18/firefox-48-blocklist-against-plugin-fingerprinting/
 * [2] https://bugzilla.mozilla.org/1237198 ***/
   // user_pref("browser.safebrowsing.blockedURIs.enabled", false);
/* 0424: disable Mozilla's tracking protection and Flash blocklist updates ***/
   // user_pref("browser.safebrowsing.provider.mozilla.gethashURL", "");
   // user_pref("browser.safebrowsing.provider.mozilla.updateURL", "");
/* 0425: disable passive Tracking Protection [FF53+]
 * Passive TP annotates channels to lower the priority of network loads for resources on the tracking protection list
 * [NOTE] It has no effect if TP is enabled, but keep in mind that by default TP is only enabled in Private Windows
 * This is included for people who want to completely disable Tracking Protection.
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1170190,1141814 ***/
   // user_pref("privacy.trackingprotection.annotate_channels", false);
   // user_pref("privacy.trackingprotection.lower_network_priority", false);
/* 0426: enforce Content Blocking (required to block cookies) [FF63+] ***/
user_pref("browser.contentblocking.enabled", true); // [DEFAULT: true]

/*** [SECTION 0500]: SYSTEM ADD-ONS / EXPERIMENTS
     System Add-ons are a method for shipping extensions, considered to be
     built-in features to Firefox, that are hidden from the about:addons UI.
     To view your System Add-ons go to about:support, they are listed under "Firefox Features"

     Some System Add-ons have no on-off prefs. Instead you can manually remove them. Note that app
     updates will restore them. They may also be updated and possibly restored automatically (see 0505)
     * Portable: "...\App\Firefox64\browser\features\" (or "App\Firefox\etc" for 32bit)
     * Windows: "...\Program Files\Mozilla\browser\features" (or "Program Files (X86)\etc" for 32bit)
     * Mac: "...\Applications\Firefox\Contents\Resources\browser\features\"
            [NOTE] On Mac you can right-click on the application and select "Show Package Contents"
     * Linux: "/usr/lib/firefox/browser/features" (or similar)

     [1] https://firefox-source-docs.mozilla.org/toolkit/mozapps/extensions/addon-manager/SystemAddons.html
     [2] https://dxr.mozilla.org/mozilla-central/source/browser/extensions
***/
user_pref("_user.js.parrot", "0500 syntax error: the parrot's cashed in 'is chips!");
/* 0502: disable Mozilla permission to silently opt you into tests ***/
user_pref("network.allow-experiments", false);
/* 0503: disable Normandy/Shield [FF60+]
 * Shield is an telemetry system (including Heartbeat) that can also push and test "recipes"
 * [1] https://wiki.mozilla.org/Firefox/Shield
 * [2] https://github.com/mozilla/normandy ***/
user_pref("app.normandy.enabled", false);
user_pref("app.normandy.api_url", "");
user_pref("app.shield.optoutstudies.enabled", false);
/* 0505: disable System Add-on updates
 * [NOTE] In FF61 and lower, you will not get any System Add-on updates except when you update Firefox ***/
   // user_pref("extensions.systemAddon.update.enabled", false); // [FF62+]
   // user_pref("extensions.systemAddon.update.url", "");
/* 0506: disable PingCentre telemetry (used in several System Add-ons) [FF57+]
 * Currently blocked by 'datareporting.healthreport.uploadEnabled' (see 0333) ***/
user_pref("browser.ping-centre.telemetry", false);
/* 0510: disable Pocket [FF46+]
 * Pocket is a third party (now owned by Mozilla) "save for later" cloud service
 * [1] https://en.wikipedia.org/wiki/Pocket_(application)
 * [2] https://www.gnu.gl/blog/Posts/multiple-vulnerabilities-in-pocket/ ***/
user_pref("extensions.pocket.enabled", false);
/* 0515: disable Screenshots
 * alternatively in FF60+, disable uploading to the Screenshots server
 * [1] https://github.com/mozilla-services/screenshots
 * [2] https://www.ghacks.net/2017/05/28/firefox-screenshots-integrated-in-firefox-nightly/ ***/
   // user_pref("extensions.screenshots.disabled", true); // [FF55+]
   // user_pref("extensions.screenshots.upload-disabled", true); // [FF60+]
/* 0516: disable Onboarding [FF55+]
 * Onboarding is an interactive tour/setup for new installs/profiles and features. Every time
 * about:home or about:newtab is opened, the onboarding overlay is injected into that page
 * [NOTE] Onboarding uses Google Analytics [2], and leaks resource://URIs [3]
 * [1] https://wiki.mozilla.org/Firefox/Onboarding
 * [2] https://github.com/mozilla/onboard/commit/db4d6c8726c89a5d6a241c1b1065827b525c5baf
 * [3] https://bugzilla.mozilla.org/863246#c154 ***/
user_pref("browser.onboarding.enabled", false);
/* 0517: disable Form Autofill
 * [NOTE] Stored data is NOT secure (uses a JSON file)
 * [NOTE] Heuristics controls Form Autofill on forms without @autocomplete attributes
 * [SETTING] Privacy & Security>Forms & Passwords>Autofill addresses
 * [1] https://wiki.mozilla.org/Firefox/Features/Form_Autofill
 * [2] https://www.ghacks.net/2017/05/24/firefoxs-new-form-autofill-is-awesome/ ***/
user_pref("extensions.formautofill.addresses.enabled", false); // [FF55+]
user_pref("extensions.formautofill.available", "off"); // [FF56+]
user_pref("extensions.formautofill.creditCards.enabled", false); // [FF56+]
user_pref("extensions.formautofill.heuristics.enabled", false); // [FF55+]
/* 0518: disable Web Compatibility Reporter [FF56+]
 * Web Compatibility Reporter adds a "Report Site Issue" button to send data to Mozilla ***/
user_pref("extensions.webcompat-reporter.enabled", false);

/*** [SECTION 0600]: BLOCK IMPLICIT OUTBOUND [not explicitly asked for - e.g. clicked on] ***/
user_pref("_user.js.parrot", "0600 syntax error: the parrot's no more!");
/* 0601: disable link prefetching
 * [1] https://developer.mozilla.org/docs/Web/HTTP/Link_prefetching_FAQ ***/
user_pref("network.prefetch-next", false);
/* 0602: disable DNS prefetching
 * [1] https://www.ghacks.net/2013/04/27/firefox-prefetching-what-you-need-to-know/
 * [2] https://developer.mozilla.org/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control ***/
user_pref("network.dns.disablePrefetch", true);
user_pref("network.dns.disablePrefetchFromHTTPS", true); // [HIDDEN PREF]
/* 0603a: disable Seer/Necko
 * [1] https://developer.mozilla.org/docs/Mozilla/Projects/Necko ***/
user_pref("network.predictor.enabled", false);
/* 0603b: disable more Necko/Captive Portal
 * [1] https://en.wikipedia.org/wiki/Captive_portal
 * [2] https://wiki.mozilla.org/Necko/CaptivePortal
 * [3] https://trac.torproject.org/projects/tor/ticket/21790 ***/
user_pref("captivedetect.canonicalURL", "");
user_pref("network.captive-portal-service.enabled", false); // [FF52+]
/* 0605: disable link-mouseover opening connection to linked server
 * [1] https://news.slashdot.org/story/15/08/14/2321202/how-to-quash-firefoxs-silent-requests
 * [2] https://www.ghacks.net/2015/08/16/block-firefox-from-connecting-to-sites-when-you-hover-over-links/ ***/
user_pref("network.http.speculative-parallel-limit", 0);
/* 0606: disable pings (but enforce same host in case)
 * [1] http://kb.mozillazine.org/Browser.send_pings
 * [2] http://kb.mozillazine.org/Browser.send_pings.require_same_host ***/
user_pref("browser.send_pings", false);
user_pref("browser.send_pings.require_same_host", true);
/* 0607: disable links launching Windows Store on Windows 8/8.1/10 [WINDOWS]
 * [1] https://www.ghacks.net/2016/03/25/block-firefox-chrome-windows-store/ ***/
user_pref("network.protocol-handler.external.ms-windows-store", false);
/* 0608: disable predictor / prefetching [FF48+] ***/
user_pref("network.predictor.enable-prefetch", false);

/*** [SECTION 0700]: HTTP* / TCP/IP / DNS / PROXY / SOCKS etc ***/
user_pref("_user.js.parrot", "0700 syntax error: the parrot's given up the ghost!");
/* 0701: disable IPv6
 * IPv6 can be abused, especially regarding MAC addresses. They also do not play nice
 * with VPNs. That's even assuming your ISP and/or router and/or website can handle it
 * [NOTE] This is just an application level fallback. Disabling IPv6 is best done
 * at an OS/network level, and/or configured properly in VPN setups
 * [TEST] http://ipv6leak.com/
 * [1] https://github.com/ghacksuserjs/ghacks-user.js/issues/437#issuecomment-403740626
 * [2] https://www.internetsociety.org/tag/ipv6-security/ (see Myths 2,4,5,6) ***/
user_pref("network.dns.disableIPv6", true);
/* 0702: disable HTTP2 (which was based on SPDY which is now deprecated)
 * HTTP2 raises concerns with "multiplexing" and "server push", does nothing to enhance
 * privacy, and in fact opens up a number of server-side fingerprinting opportunities
 * [1] https://http2.github.io/faq/
 * [2] https://blog.scottlogic.com/2014/11/07/http-2-a-quick-look.html
 * [3] https://queue.acm.org/detail.cfm?id=2716278
 * [4] https://github.com/ghacksuserjs/ghacks-user.js/issues/107 ***/
user_pref("network.http.spdy.enabled", false);
user_pref("network.http.spdy.enabled.deps", false);
user_pref("network.http.spdy.enabled.http2", false);
/* 0703: disable HTTP Alternative Services [FF37+]
 * [1] https://tools.ietf.org/html/rfc7838#section-9
 * [2] https://www.mnot.net/blog/2016/03/09/alt-svc ***/
user_pref("network.http.altsvc.enabled", false);
user_pref("network.http.altsvc.oe", false);
/* 0704: enforce the proxy server to do any DNS lookups when using SOCKS
 * e.g. in Tor, this stops your local DNS server from knowing your Tor destination
 * as a remote Tor node will handle the DNS request
 * [1] http://kb.mozillazine.org/Network.proxy.socks_remote_dns
 * [2] https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO/WebBrowsers ***/
user_pref("network.proxy.socks_remote_dns", true);
/* 0706: remove paths when sending URLs to PAC scripts [FF51+]
 * CVE-2017-5384: Information disclosure via Proxy Auto-Config (PAC)
 * [1] https://bugzilla.mozilla.org/1255474 ***/
user_pref("network.proxy.autoconfig_url.include_path", false); // [DEFAULT: false]
/* 0707: disable (or setup) DNS-over-HTTPS (DoH) [FF60+]
 * TRR = Trusted Recursive Resolver
 * .mode: 0=off, 1=race, 2=TRR first, 3=TRR only, 4=race for stats, but always use native result
 * [WARNING] DoH bypasses hosts and gives info to yet another party (e.g. Cloudflare)
 * [1] https://www.ghacks.net/2018/04/02/configure-dns-over-https-in-firefox/
 * [2] https://hacks.mozilla.org/2018/05/a-cartoon-intro-to-dns-over-https/ ***/
   // user_pref("network.trr.mode", 0);
   // user_pref("network.trr.bootstrapAddress", "");
   // user_pref("network.trr.uri", "");
/* 0708: disable FTP [FF60+]
 * [1] https://www.ghacks.net/2018/02/20/firefox-60-with-new-preference-to-disable-ftp/ ***/
   // user_pref("network.ftp.enabled", false);
/* 0709: disable using UNC (Uniform Naming Convention) paths [FF61+]
 * [1] https://trac.torproject.org/projects/tor/ticket/26424 ***/
user_pref("network.file.disable_unc_paths", true); // [HIDDEN PREF]
/* 0710: disable GIO as a potential proxy bypass vector
 * Gvfs/GIO has a set of supported protocols like obex, network, archive, computer, dav, cdda,
 * gphoto2, trash, etc. By default only smb and sftp protocols are accepted so far (as of FF64)
 * [1] https://bugzilla.mozilla.org/1433507
 * [2] https://trac.torproject.org/23044
 * [3] https://en.wikipedia.org/wiki/GVfs
 * [4] https://en.wikipedia.org/wiki/GIO_(software) ***/
user_pref("network.gio.supported-protocols", ""); // [HIDDEN PREF]

/*** [SECTION 0800]: LOCATION BAR / SEARCH BAR / SUGGESTIONS / HISTORY / FORMS [SETUP-CHROME]
     If you are in a private environment (no unwanted eyeballs) and your device is private
     (restricted access), and the device is secure when unattended (locked, encrypted, forensic
     hardened), then items 0850 and above can be relaxed in return for more convenience and
     functionality. Likewise, you may want to check the items cleared on shutdown in section 2800.
     [NOTE] The urlbar is also commonly referred to as the location bar and address bar
     #Required reading [#] https://xkcd.com/538/
***/
user_pref("_user.js.parrot", "0800 syntax error: the parrot's ceased to be!");
/* 0801: disable location bar using search
 * don't leak typos to a search engine, give an error message instead ***/
user_pref("keyword.enabled", false);
/* 0802: disable location bar domain guessing
 * domain guessing intercepts DNS "hostname not found errors" and resends a
 * request (e.g. by adding www or .com). This is inconsistent use (e.g. FQDNs), does not work
 * via Proxy Servers (different error), is a flawed use of DNS (TLDs: why treat .com
 * as the 411 for DNS errors?), privacy issues (why connect to sites you didn't
 * intend to), can leak sensitive data (e.g. query strings: e.g. Princeton attack),
 * and is a security risk (e.g. common typos & malicious sites set up to exploit this) ***/
user_pref("browser.fixup.alternate.enabled", false);
/* 0803: display all parts of the url in the location bar ***/
user_pref("browser.urlbar.trimURLs", false);
/* 0804: limit history leaks via enumeration (PER TAB: back/forward)
 * This is a PER TAB session history. You still have a full history stored under all history
 * default=50, minimum=1=currentpage, 2 is the recommended minimum as some pages
 * use it as a means of referral (e.g. hotlinking), 4 or 6 or 10 may be more practical ***/
user_pref("browser.sessionhistory.max_entries", 10);
/* 0805: disable CSS querying page history - CSS history leak
 * [NOTE] This has NEVER been fully "resolved": in Mozilla/docs it is stated it's
 * only in 'certain circumstances', also see latest comments in [2]
 * [TEST] http://lcamtuf.coredump.cx/yahh/ (see github wiki APPENDIX C on how to use)
 * [1] https://dbaron.org/mozilla/visited-privacy
 * [2] https://bugzilla.mozilla.org/147777
 * [3] https://developer.mozilla.org/docs/Web/CSS/Privacy_and_the_:visited_selector ***/
user_pref("layout.css.visited_links_enabled", false);
/* 0806: disable displaying javascript in history URLs ***/
user_pref("browser.urlbar.filter.javascript", true);
/* 0807: disable search bar LIVE search suggestions
 * [SETTING] Search>Provide search suggestions ***/
user_pref("browser.search.suggest.enabled", false);
/* 0808: disable location bar LIVE search suggestions (requires 0807 = true)
 * Also disable the location bar prompt to enable/disable or learn more about it.
 * [SETTING] Search>Show search suggestions in address bar results ***/
user_pref("browser.urlbar.suggest.searches", false);
user_pref("browser.urlbar.userMadeSearchSuggestionsChoice", true); // [FF41+]
/* 0809: disable location bar suggesting "preloaded" top websites [FF54+]
 * [1] https://bugzilla.mozilla.org/1211726 ***/
user_pref("browser.urlbar.usepreloadedtopurls.enabled", false);
/* 0810: disable location bar making speculative connections [FF56+]
 * [1] https://bugzilla.mozilla.org/1348275 ***/
user_pref("browser.urlbar.speculativeConnect.enabled", false);
/* 0850a: disable location bar autocomplete and suggestion types
 * If you enforce any of the suggestion types, you MUST enforce 'autocomplete'
 *   - If *ALL* of the suggestion types are false, 'autocomplete' must also be false
 *   - If *ANY* of the suggestion types are true, 'autocomplete' must also be true
 * [SETUP-CHROME] If all three suggestion types are false, search engine keywords are disabled
 * [SETTING] Privacy & Security>Address Bar>When using the address bar, suggest ***/
user_pref("browser.urlbar.autocomplete.enabled", false);
user_pref("browser.urlbar.suggest.history", false);
user_pref("browser.urlbar.suggest.bookmark", false);
user_pref("browser.urlbar.suggest.openpage", false);
/* 0850c: disable location bar dropdown
 * This value controls the total number of entries to appear in the location bar dropdown
 * [NOTE] Items (bookmarks/history/openpages) with a high "frecency"/"bonus" will always
 * be displayed (no we do not know how these are calculated or what the threshold is),
 * and this does not affect the search by search engine suggestion (see 0808)
 * [NOTE] This setting is only useful if you want to enable search engine keywords
 * (i.e. at least one of 0850a suggestion types must be true) but you want to *limit* suggestions shown ***/
   // user_pref("browser.urlbar.maxRichResults", 0);
/* 0850d: disable location bar autofill
 * [1] http://kb.mozillazine.org/Inline_autocomplete ***/
user_pref("browser.urlbar.autoFill", false);
/* 0850e: disable location bar one-off searches [FF51+]
 * [1] https://www.ghacks.net/2016/08/09/firefox-one-off-searches-address-bar/ ***/
user_pref("browser.urlbar.oneOffSearches", false);
/* 0850f: disable location bar suggesting local search history [FF57+]
 * [1] https://bugzilla.mozilla.org/1181644 ***/
user_pref("browser.urlbar.maxHistoricalSearchSuggestions", 0);
/* 0860: disable search and form history
 * [NOTE] You can clear formdata on exiting Firefox (see 2803)
 * [SETTING] Privacy & Security>History>Custom Settings>Remember search and form history ***/
user_pref("browser.formfill.enable", false);
/* 0862: disable browsing and download history
 * [NOTE] You can clear history and downloads on exiting Firefox (see 2803)
 * [SETTING] Privacy & Security>History>Custom Settings>Remember browsing and download history ***/
   // user_pref("places.history.enabled", false);
/* 0864: disable date/time picker
 * This can leak your locale if not en-US
 * [1] https://trac.torproject.org/projects/tor/ticket/21787 ***/
user_pref("dom.forms.datetime", false);
/* 0870: disable Windows jumplist [WINDOWS] ***/
user_pref("browser.taskbar.lists.enabled", false);
user_pref("browser.taskbar.lists.frequent.enabled", false);
user_pref("browser.taskbar.lists.recent.enabled", false);
user_pref("browser.taskbar.lists.tasks.enabled", false);
/* 0871: disable Windows taskbar preview [WINDOWS] ***/
user_pref("browser.taskbar.previews.enable", false);

/*** [SECTION 0900]: PASSWORDS ***/
user_pref("_user.js.parrot", "0900 syntax error: the parrot's expired!");
/* 0901: disable saving passwords
 * [NOTE] This does not clear any passwords already saved
 * [SETTING] Privacy & Security>Forms & Passwords>Ask to save logins and passwords for websites ***/
   // user_pref("signon.rememberSignons", false);
/* 0902: use a master password (recommended if you save passwords)
 * There are no preferences for this. It is all handled internally.
 * [SETTING] Privacy & Security>Forms & Passwords>Use a master password
 * [1] https://support.mozilla.org/kb/use-master-password-protect-stored-logins ***/
/* 0903: set how often Firefox should ask for the master password
 * 0=the first time (default), 1=every time it's needed, 2=every n minutes (see 0904) ***/
user_pref("security.ask_for_password", 2);
/* 0904: set how often in minutes Firefox should ask for the master password (see 0903)
 * in minutes, default is 30 ***/
user_pref("security.password_lifetime", 5);
/* 0905: disable auto-filling username & password form fields
 * can leak in cross-site forms AND be spoofed
 * [NOTE] Password will still be auto-filled after a user name is manually entered
 * [1] http://kb.mozillazine.org/Signon.autofillForms ***/
user_pref("signon.autofillForms", false);
/* 0906: disable websites' autocomplete="off" [FF30+]
 * Don't let sites dictate use of saved logins and passwords. Increase security through
 * stronger password use. The trade-off is the convenience. Some sites should never be
 * saved (such as banking sites). Set at true, informed users can make their own choice. ***/
user_pref("signon.storeWhenAutocompleteOff", true); // [DEFAULT: true]
/* 0907: display warnings for logins on non-secure (non HTTPS) pages
 * [1] https://bugzilla.mozilla.org/1217156 ***/
user_pref("security.insecure_password.ui.enabled", true);
/* 0908: remove user & password info when attempting to fix an entered URL (i.e. 0802 is true)
 * e.g. //user:password@foo -> //user@(prefix)foo(suffix) NOT //user:password@(prefix)foo(suffix) ***/
user_pref("browser.fixup.hide_user_pass", true);
/* 0909: disable formless login capture for Password Manager [FF51+] ***/
user_pref("signon.formlessCapture.enabled", false);
/* 0910: disable autofilling saved passwords on HTTP pages and show warning [FF52+]
 * [1] https://www.fxsitecompat.com/en-CA/docs/2017/insecure-login-forms-now-disable-autofill-show-warning-beneath-input-control/
 * [2] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1217152,1319119 ***/
user_pref("signon.autofillForms.http", false);
user_pref("security.insecure_field_warning.contextual.enabled", true);
/* 0911: prevent cross-origin images from triggering an HTTP-Authentication prompt [FF55+]
 * [1] https://bugzilla.mozilla.org/1357835 ***/
user_pref("network.auth.subresource-img-cross-origin-http-auth-allow", false);

/*** [SECTION 1000]: CACHE [SETUP-CHROME]
     ETAG [1] and other [2][3] cache tracking/fingerprinting techniques can be averted by
     disabling *BOTH* disk (1001) and memory (1003) cache. ETAGs can also be neutralized
     by modifying response headers [4]. Another solution is to use a hardened configuration
     with Temporary Containers [5]. Alternatively, you can *LIMIT* exposure by clearing
     cache on close (2803). or on a regular basis manually or with an extension.
     [1] https://en.wikipedia.org/wiki/HTTP_ETag#Tracking_using_ETags
     [2] https://robertheaton.com/2014/01/20/cookieless-user-tracking-for-douchebags/
     [3] https://www.grepular.com/Preventing_Web_Tracking_via_the_Browser_Cache
     [4] https://github.com/ghacksuserjs/ghacks-user.js/wiki/4.2.4-Header-Editor
     [5] https://medium.com/@stoically/enhance-your-privacy-in-firefox-with-temporary-containers-33925cd6cd21
***/
user_pref("_user.js.parrot", "1000 syntax error: the parrot's gone to meet 'is maker!");
/** CACHE ***/
/* 1001: disable disk cache ***/
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.disk.capacity", 0);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.cache.disk.smart_size.first_run", false);
/* 1002: disable disk cache for SSL pages
 * [1] http://kb.mozillazine.org/Browser.cache.disk_cache_ssl ***/
user_pref("browser.cache.disk_cache_ssl", false);
/* 1003: disable memory cache
 * [NOTE] Not recommended due to performance issues ***/
   // user_pref("browser.cache.memory.enable", false);
   // user_pref("browser.cache.memory.capacity", 0); // [HIDDEN PREF]
/* 1005: disable fastback cache
 * To improve performance when pressing back/forward Firefox stores visited pages
 * so they don't have to be re-parsed. This is not the same as memory cache.
 * 0=none, -1=auto (that's minus 1), or for other values see [1]
 * [WARNING] Not recommended unless you know what you're doing
 * [1] http://kb.mozillazine.org/Browser.sessionhistory.max_total_viewers ***/
   // user_pref("browser.sessionhistory.max_total_viewers", 0);
/* 1006: disable permissions manager from writing to disk [RESTART]
 * [NOTE] This means any permission changes are session only
 * [1] https://bugzilla.mozilla.org/967812 ***/
   // user_pref("permissions.memory_only", true); // [HIDDEN PREF]
/* 1008: set DNS cache and expiration time (default 400 and 60, same as Tor Browser) ***/
   // user_pref("network.dnsCacheEntries", 400);
   // user_pref("network.dnsCacheExpiration", 60);
/** SESSIONS & SESSION RESTORE ***/
/* 1020: limit Session Restore to last active tab and window
 * [SETUP-CHROME] This also disables the "Recently Closed Tabs" feature
 * It does not affect "Recently Closed Windows" or any history. ***/
user_pref("browser.sessionstore.max_tabs_undo", 0);
user_pref("browser.sessionstore.max_windows_undo", 0);
/* 1021: disable storing extra session data [SETUP-CHROME]
 * extra session data contains contents of forms, scrollbar positions, cookies and POST data
 * define on which sites to save extra session data:
 * 0=everywhere, 1=unencrypted sites, 2=nowhere ***/
user_pref("browser.sessionstore.privacy_level", 2);
/* 1022: disable resuming session from crash [SETUP-CHROME] ***/
user_pref("browser.sessionstore.resume_from_crash", false);
/* 1023: set the minimum interval between session save operations
 * Increasing this can help on older machines and some websites, as well as reducing writes, see [1]
 * Default is 15000 (15 secs). Try 30000 (30sec), 60000 (1min) etc
 * [SETUP-CHROME] This can also affect entries in the "Recently Closed Tabs" feature:
 * i.e. the longer the interval the more chance a quick tab open/close won't be captured.
 * This longer interval *may* affect history but we cannot replicate any history not recorded
 * [1] https://bugzilla.mozilla.org/1304389 ***/
user_pref("browser.sessionstore.interval", 30000);
/* 1024: disable automatic Firefox start and session restore after reboot [FF62+] [WINDOWS]
 * [1] https://bugzilla.mozilla.org/603903 ***/
user_pref("toolkit.winRegisterApplicationRestart", false);
/** FAVICONS ***/
/* 1030: disable favicons in shortcuts
 * URL shortcuts use a cached randomly named .ico file which is stored in your
 * profile/shortcutCache directory. The .ico remains after the shortcut is deleted.
 * If set to false then the shortcuts use a generic Firefox icon ***/
user_pref("browser.shell.shortcutFavicons", false);
/* 1031: disable favicons in tabs and new bookmarks
 * bookmark favicons are stored as data blobs in favicons.sqlite ***/
   // user_pref("browser.chrome.site_icons", false);
/* 1032: disable favicons in web notifications ***/
user_pref("alerts.showFavicons", false); // [DEFAULT: false]

/*** [SECTION 1200]: HTTPS (SSL/TLS / OCSP / CERTS / HSTS / HPKP / CIPHERS)
   Note that your cipher and other settings can be used server side as a fingerprint attack
   vector, see [1] (It's quite technical but the first part is easy to understand
   and you can stop reading when you reach the second section titled "Enter Bro")

   Option 1: Use Firefox defaults for the 1260's items (item 1260 default for SHA-1, is local
             only anyway). There is nothing *weak* about Firefox's defaults, but Mozilla (and
             other browsers) will always lag for fear of breakage and upset end-users
   Option 2: Disable the ciphers in 1261, 1262 and 1263. These shouldn't break anything.
             Optionally, disable the ciphers in 1264.

   [1] https://www.securityartwork.es/2017/02/02/tls-client-fingerprinting-with-bro/
***/
user_pref("_user.js.parrot", "1200 syntax error: the parrot's a stiff!");
/** SSL (Secure Sockets Layer) / TLS (Transport Layer Security) ***/
/* 1201: disable old SSL/TLS "insecure" renegotiation (vulnerable to a MiTM attack)
 * [SETUP-WEB] <2% of secure sites do NOT support the newer "secure" renegotiation, see [2]
 * [1] https://wiki.mozilla.org/Security:Renegotiation
 * [2] https://www.ssllabs.com/ssl-pulse/ ***/
user_pref("security.ssl.require_safe_negotiation", true);
/* 1202: control TLS versions with min and max
 * 1=TLS 1.0, 2=TLS 1.1, 3=TLS 1.2, 4=TLS 1.3 etc
 * [NOTE] Jul-2017: Telemetry indicates approx 2% of TLS web traffic uses 1.0 or 1.1
 * [1] http://kb.mozillazine.org/Security.tls.version.*
 * [2] https://www.ssl.com/how-to/turn-off-ssl-3-0-and-tls-1-0-in-your-browser/
 * [2] archived: https://archive.is/hY2Mm ***/
   // user_pref("security.tls.version.min", 3);
user_pref("security.tls.version.max", 4);
/* 1203: disable SSL session tracking [FF36+]
 * SSL Session IDs speed up HTTPS connections (no need to renegotiate) and last for 24hrs.
 * Since the ID is unique, web servers can (and do) use it for tracking. If set to true,
 * this disables sending SSL Session IDs and TLS Session Tickets to prevent session tracking
 * [1] https://tools.ietf.org/html/rfc5077
 * [2] https://bugzilla.mozilla.org/967977 ***/
user_pref("security.ssl.disable_session_identifiers", true); // [HIDDEN PREF]
/* 1204: disable SSL Error Reporting
 * [1] https://firefox-source-docs.mozilla.org/browser/base/sslerrorreport/preferences.html ***/
user_pref("security.ssl.errorReporting.automatic", false);
user_pref("security.ssl.errorReporting.enabled", false);
user_pref("security.ssl.errorReporting.url", "");
/* 1205: disable TLS1.3 0-RTT (round-trip time) [FF51+]
 * [1] https://github.com/tlswg/tls13-spec/issues/1001
 * [2] https://blog.cloudflare.com/tls-1-3-overview-and-q-and-a/ ***/
user_pref("security.tls.enable_0rtt_data", false);

/** OCSP (Online Certificate Status Protocol)
    #Required reading [#] https://scotthelme.co.uk/revocation-is-broken/ ***/
/* 1210: enable OCSP Stapling
 * [1] https://blog.mozilla.org/security/2013/07/29/ocsp-stapling-in-firefox/ ***/
user_pref("security.ssl.enable_ocsp_stapling", true);
/* 1211: control when to use OCSP fetching (to confirm current validity of certificates)
 * 0=disabled, 1=enabled (default), 2=enabled for EV certificates only
 * OCSP (non-stapled) leaks information about the sites you visit to the CA (cert authority)
 * It's a trade-off between security (checking) and privacy (leaking info to the CA)
 * [NOTE] This pref only controls OCSP fetching and does not affect OCSP stapling
 * [1] https://en.wikipedia.org/wiki/Ocsp ***/
user_pref("security.OCSP.enabled", 1);
/* 1212: set OCSP fetch failures (non-stapled, see 1211) to hard-fail [SETUP-WEB]
 * When a CA cannot be reached to validate a cert, Firefox just continues the connection (=soft-fail)
 * Setting this pref to true tells Firefox to instead terminate the connection (=hard-fail)
 * It is pointless to soft-fail when an OCSP fetch fails: you cannot confirm a cert is still valid (it
 * could have been revoked) and/or you could be under attack (e.g. malicious blocking of OCSP servers)
 * [1] https://blog.mozilla.org/security/2013/07/29/ocsp-stapling-in-firefox/
 * [2] https://www.imperialviolet.org/2014/04/19/revchecking.html ***/
user_pref("security.OCSP.require", true);

/** CERTS / HSTS (HTTP Strict Transport Security) / HPKP (HTTP Public Key Pinning) ***/
/* 1220: disable Windows 8.1's Microsoft Family Safety cert [FF50+] [WINDOWS]
 * 0=disable detecting Family Safety mode and importing the root
 * 1=only attempt to detect Family Safety mode (don't import the root)
 * 2=detect Family Safety mode and import the root
 * [1] https://trac.torproject.org/projects/tor/ticket/21686 ***/
user_pref("security.family_safety.mode", 0);
/* 1221: disable intermediate certificate caching (fingerprinting attack vector) [RESTART]
 * [NOTE] This affects login/cert/key dbs. The effect is all credentials are session-only.
 * Saved logins and passwords are not available. Reset the pref and restart to return them.
 * [TEST] https://fiprinca.0x90.eu/poc/
 * [1] https://bugzilla.mozilla.org/1334485 - related bug
 * [2] https://bugzilla.mozilla.org/1216882 - related bug (see comment 9) ***/
   // user_pref("security.nocertdb", true); // [HIDDEN PREF]
/* 1222: enforce strict pinning
 * PKP (Public Key Pinning) 0=disabled 1=allow user MiTM (such as your antivirus), 2=strict
 * [WARNING] If you rely on an AV (antivirus) to protect your web browsing
 * by inspecting ALL your web traffic, then leave at current default=1
 * [1] https://trac.torproject.org/projects/tor/ticket/16206 ***/
user_pref("security.cert_pinning.enforcement_level", 2);

/** MIXED CONTENT ***/
/* 1240: disable insecure active content on https pages
 * [1] https://trac.torproject.org/projects/tor/ticket/21323 ***/
user_pref("security.mixed_content.block_active_content", true); // [DEFAULT: true]
/* 1241: disable insecure passive content (such as images) on https pages ***/
user_pref("security.mixed_content.block_display_content", true);
/* 1243: block unencrypted requests from Flash on encrypted pages to mitigate MitM attacks [FF59+]
 * [1] https://bugzilla.mozilla.org/1190623 ***/
user_pref("security.mixed_content.block_object_subrequest", true);

/** CIPHERS [see the section 1200 intro] ***/
/* 1260: disable or limit SHA-1
 * 0=all SHA1 certs are allowed
 * 1=all SHA1 certs are blocked (including perfectly valid ones from 2015 and earlier)
 * 2=deprecated option that now maps to 1
 * 3=only allowed for locally-added roots (e.g. anti-virus)
 * 4=only allowed for locally-added roots or for certs in 2015 and earlier
 * [SETUP-WEB] When disabled, some man-in-the-middle devices (e.g. security scanners and
 * antivirus products, may fail to connect to HTTPS sites. SHA-1 is *almost* obsolete.
 * [1] https://blog.mozilla.org/security/2016/10/18/phasing-out-sha-1-on-the-public-web/ ***/
user_pref("security.pki.sha1_enforcement_level", 1);
/* 1261: disable 3DES (effective key size < 128)
 * [1] https://en.wikipedia.org/wiki/3des#Security
 * [2] http://en.citizendium.org/wiki/Meet-in-the-middle_attack
 * [3] https://www-archive.mozilla.org/projects/security/pki/nss/ssl/fips-ssl-ciphersuites.html ***/
   // user_pref("security.ssl3.rsa_des_ede3_sha", false);
/* 1262: disable 128 bits ***/
   // user_pref("security.ssl3.ecdhe_ecdsa_aes_128_sha", false);
   // user_pref("security.ssl3.ecdhe_rsa_aes_128_sha", false);
/* 1263: disable DHE (Diffie-Hellman Key Exchange)
 * [1] https://www.eff.org/deeplinks/2015/10/how-to-protect-yourself-from-nsa-attacks-1024-bit-DH ***/
   // user_pref("security.ssl3.dhe_rsa_aes_128_sha", false);
   // user_pref("security.ssl3.dhe_rsa_aes_256_sha", false);
/* 1264: disable the remaining non-modern cipher suites as of FF52 ***/
   // user_pref("security.ssl3.rsa_aes_128_sha", false);
   // user_pref("security.ssl3.rsa_aes_256_sha", false);

/** UI (User Interface) ***/
/* 1270: display warning (red padlock) for "broken security" (see 1201)
 * [1] https://wiki.mozilla.org/Security:Renegotiation ***/
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
/* 1271: control "Add Security Exception" dialog on SSL warnings
 * 0=do neither 1=pre-populate url 2=pre-populate url + pre-fetch cert (default)
 * [1] https://github.com/pyllyukko/user.js/issues/210 ***/
user_pref("browser.ssl_override_behavior", 1);
/* 1272: display advanced information on Insecure Connection warning pages
 * only works when it's possible to add an exception
 * i.e. it doesn't work for HSTS discrepancies (https://subdomain.preloaded-hsts.badssl.com/)
 * [TEST] https://expired.badssl.com/ ***/
user_pref("browser.xul.error_pages.expert_bad_cert", true);
/* 1273: display "insecure" icon and "Not Secure" text on HTTP sites ***/
user_pref("security.insecure_connection_icon.enabled", true); // [FF59+]
user_pref("security.insecure_connection_text.enabled", true); // [FF60+]
   // user_pref("security.insecure_connection_icon.pbmode.enabled", true); // [FF59+] private windows only
   // user_pref("security.insecure_connection_text.pbmode.enabled", true); // [FF60+] private windows only

/*** [SECTION 1400]: FONTS ***/
user_pref("_user.js.parrot", "1400 syntax error: the parrot's bereft of life!");
/* 1401: disable websites choosing fonts (0=block, 1=allow)
 * If you disallow fonts, this drastically limits/reduces font
 * enumeration (by JS) which is a high entropy fingerprinting vector.
 * [NOTE] Disabling fonts can uglify the web a fair bit.
 * [SETTING] General>Language and Appearance>Fonts & Colors>Advanced>Allow pages to choose... ***/
user_pref("browser.display.use_document_fonts", 0);
/* 1402: set more legible default fonts
 * [NOTE] Example below for Windows/Western only
 * [SETTING] General>Language and Appearance>Fonts & Colors>Advanced>Serif|Sans-serif|Monospace ***/
   // user_pref("font.name.serif.x-unicode", "Georgia");
   // user_pref("font.name.serif.x-western", "Georgia"); // default: Times New Roman
   // user_pref("font.name.sans-serif.x-unicode", "Arial");
   // user_pref("font.name.sans-serif.x-western", "Arial"); // default: Arial
   // user_pref("font.name.monospace.x-unicode", "Lucida Console");
   // user_pref("font.name.monospace.x-western", "Lucida Console"); // default: Courier New
/* 1403: disable icon fonts (glyphs) and local fallback rendering
 * [1] https://bugzilla.mozilla.org/789788
 * [2] https://trac.torproject.org/projects/tor/ticket/8455 ***/
   // user_pref("gfx.downloadable_fonts.enabled", false); // [FF41+]
   // user_pref("gfx.downloadable_fonts.fallback_delay", -1);
/* 1404: disable rendering of SVG OpenType fonts
 * [1] https://wiki.mozilla.org/SVGOpenTypeFonts - iSECPartnersReport recommends to disable this ***/
user_pref("gfx.font_rendering.opentype_svg.enabled", false);
/* 1405: disable WOFF2 (Web Open Font Format) [FF35+] ***/
user_pref("gfx.downloadable_fonts.woff2.enabled", false);
/* 1406: disable CSS Font Loading API
 * [NOTE] Disabling fonts can uglify the web a fair bit. ***/
user_pref("layout.css.font-loading-api.enabled", false);
/* 1407: disable special underline handling for a few fonts which you will probably never use [RESTART]
 * Any of these fonts on your system can be enumerated for fingerprinting.
 * [1] http://kb.mozillazine.org/Font.blacklist.underline_offset ***/
user_pref("font.blacklist.underline_offset", "");
/* 1408: disable graphite which FF49 turned back on by default
 * In the past it had security issues. Update: This continues to be the case, see [1]
 * [1] https://www.mozilla.org/security/advisories/mfsa2017-15/#CVE-2017-7778 ***/
user_pref("gfx.font_rendering.graphite.enabled", false);
/* 1409: limit system font exposure to a whitelist [FF52+] [RESTART]
 * If the whitelist is empty, then whitelisting is considered disabled and all fonts are allowed.
 * [WARNING] Creating your own probably highly-unique whitelist will raise your entropy. If
 * you block sites choosing fonts in 1401, this preference is irrelevant. In future,
 * privacy.resistFingerprinting (see 4500) will cover this (and 1401 can be relaxed)
 * [1] https://bugzilla.mozilla.org/1121643 ***/
   // user_pref("font.system.whitelist", ""); // [HIDDEN PREF]

/*** [SECTION 1600]: HEADERS / REFERERS
     Only *cross domain* referers need controlling and XOriginPolicy (1603) is perfect for that. Thus we enforce
     the default values for 1601, 1602, 1605 and 1606 to minimize breakage, and only tweak 1603 and 1604.

     Our default settings provide the best balance between protection and amount of breakage.
     To harden it a bit more you can set XOriginPolicy (1603) to 2 (+ optionally 1604 to 1 or 2).
     To fix broken sites (including your modem/router), temporarily set XOriginPolicy=0 and XOriginTrimmingPolicy=2 in about:config,
     use the site and then change the values back. If you visit those sites regularly (e.g. Vimeo), use an extension.

                    full URI: https://example.com:8888/foo/bar.html?id=1234
       scheme+host+port+path: https://example.com:8888/foo/bar.html
            scheme+host+port: https://example.com:8888

     #Required reading [#] https://feeding.cloud.geek.nz/posts/tweaking-referrer-for-privacy-in-firefox/
***/
user_pref("_user.js.parrot", "1600 syntax error: the parrot rests in peace!");
/* 1601: ALL: control when images/links send a referer
 * 0=never, 1=send only when links are clicked, 2=for links and images (default) ***/
user_pref("network.http.sendRefererHeader", 2);
/* 1602: ALL: control the amount of information to send
 * 0=send full URI (default), 1=scheme+host+port+path, 2=scheme+host+port ***/
user_pref("network.http.referer.trimmingPolicy", 0);
/* 1603: CROSS ORIGIN: control when to send a referer [SETUP-WEB]
 * 0=always (default), 1=only if base domains match, 2=only if hosts match ***/
user_pref("network.http.referer.XOriginPolicy", 1);
/* 1604: CROSS ORIGIN: control the amount of information to send [FF52+]
 * 0=send full URI (default), 1=scheme+host+port+path, 2=scheme+host+port ***/
user_pref("network.http.referer.XOriginTrimmingPolicy", 0);
/* 1605: ALL: disable spoofing a referer
 * [WARNING] Do not set this to true, as spoofing effectively disables the anti-CSRF
 * (Cross-Site Request Forgery) protections that some sites may rely on ***/
user_pref("network.http.referer.spoofSource", false); // [DEFAULT: false]
/* 1606: ALL: set the default Referrer Policy [FF59+]
 * 0=no-referer, 1=same-origin, 2=strict-origin-when-cross-origin, 3=no-referrer-when-downgrade
 * [NOTE] This is only a default, it can be overridden by a site-controlled Referrer Policy
 * [1] https://www.w3.org/TR/referrer-policy/
 * [2] https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy
 * [3] https://blog.mozilla.org/security/2018/01/31/preventing-data-leaks-by-stripping-path-information-in-http-referrers/ ***/
user_pref("network.http.referer.defaultPolicy", 3); // [DEFAULT: 3]
user_pref("network.http.referer.defaultPolicy.pbmode", 2); // [DEFAULT: 2]
/* 1607: TOR: hide (not spoof) referrer when leaving a .onion domain [FF54+]
 * [NOTE] Firefox cannot access .onion sites by default. We recommend you use
 * the Tor Browser which is specifically designed for hidden services
 * [1] https://bugzilla.mozilla.org/1305144 ***/
user_pref("network.http.referer.hideOnionSource", true);
/* 1610: ALL: enable the DNT (Do Not Track) HTTP header
 * [NOTE] DNT is enforced with TP (see 0420) regardless of this pref
 * [SETTING] Privacy & Security>Content Blocking>Send websites a "Do Not Track"... ***/
user_pref("privacy.donottrackheader.enabled", true);

/*** [SECTION 1700]: CONTAINERS
     [1] https://support.mozilla.org/kb/containers-experiment
     [2] https://wiki.mozilla.org/Security/Contextual_Identity_Project/Containers
     [3] https://github.com/mozilla/testpilot-containers
***/
user_pref("_user.js.parrot", "1700 syntax error: the parrot's bit the dust!");
/* 1701: enable Container Tabs setting in preferences (see 1702) [FF50+]
 * [1] https://bugzilla.mozilla.org/1279029 ***/
user_pref("privacy.userContext.ui.enabled", true);
/* 1702: enable Container Tabs [FF50+]
 * [SETTING] General>Tabs>Enable Container Tabs ***/
user_pref("privacy.userContext.enabled", true);
/* 1703: enable a private container for thumbnail loads [FF51+] ***/
user_pref("privacy.usercontext.about_newtab_segregation.enabled", true); // [DEFAULT: true in FF61+]
/* 1704: set long press behaviour on "+ Tab" button to display container menu [FF53+]
 * 0=disables long press, 1=when clicked, the menu is shown
 * 2=the menu is shown after X milliseconds
 * [NOTE] The menu does not contain a non-container tab option
 * [1] https://bugzilla.mozilla.org/1328756 ***/
user_pref("privacy.userContext.longPressBehavior", 2);

/*** [SECTION 1800]: PLUGINS ***/
user_pref("_user.js.parrot", "1800 syntax error: the parrot's pushing up daisies!");
/* 1801: set default plugin state (i.e. new plugins on discovery) to never activate
 * 0=disabled, 1=ask to activate, 2=active - you can override individual plugins ***/
user_pref("plugin.default.state", 0);
user_pref("plugin.defaultXpi.state", 0);
/* 1802: enable click to play and set to 0 minutes ***/
user_pref("plugins.click_to_play", true);
user_pref("plugin.sessionPermissionNow.intervalInMinutes", 0);
/* 1803: disable Flash plugin (Add-ons>Plugins)
 * 0=deactivated, 1=ask, 2=enabled
 * ESR52.x is the last branch to *fully* support NPAPI, FF52+ stable only supports Flash
 * [NOTE] You can still override individual sites via site permissions
 * [1] https://www.ghacks.net/2013/07/09/how-to-make-sure-that-a-firefox-plugin-never-activates-again/ ***/
user_pref("plugin.state.flash", 0);
/* 1805: disable scanning for plugins [WINDOWS]
 * [1] http://kb.mozillazine.org/Plugin_scanning
 * plid.all = whether to scan the directories specified in the Windows registry for PLIDs.
 * Used to detect RealPlayer, Java, Antivirus etc, but since FF52 only covers Flash ***/
user_pref("plugin.scan.plid.all", false);
/* 1820: disable all GMP (Gecko Media Plugins) [SETUP-WEB]
 * [1] https://wiki.mozilla.org/GeckoMediaPlugins ***/
user_pref("media.gmp-provider.enabled", false);
user_pref("media.gmp.trial-create.enabled", false);
user_pref("media.gmp-manager.url", "data:text/plain,");
user_pref("media.gmp-manager.url.override", "data:text/plain,"); // [HIDDEN PREF]
user_pref("media.gmp-manager.updateEnabled", false); // disable local fallback [HIDDEN PREF]
/* 1825: disable widevine CDM (Content Decryption Module) [SETUP-WEB] ***/
user_pref("media.gmp-widevinecdm.visible", false);
user_pref("media.gmp-widevinecdm.enabled", false);
user_pref("media.gmp-widevinecdm.autoupdate", false);
/* 1830: disable all DRM content (EME: Encryption Media Extension) [SETUP-WEB]
 * [SETTING] General>DRM Content>Play DRM-controlled content
 * [1] https://www.eff.org/deeplinks/2017/10/drms-dead-canary-how-we-just-lost-web-what-we-learned-it-and-what-we-need-do-next ***/
user_pref("media.eme.enabled", false);
/* 1840: disable the OpenH264 Video Codec by Cisco to "Never Activate"
 * This is the bundled codec used for video chat in WebRTC [SETUP-WEB] ***/
user_pref("media.gmp-gmpopenh264.enabled", false); // [HIDDEN PREF]
user_pref("media.gmp-gmpopenh264.autoupdate", false);

/*** [SECTION 2000]: MEDIA / CAMERA / MIC ***/
user_pref("_user.js.parrot", "2000 syntax error: the parrot's snuffed it!");
/* 2001: disable WebRTC (Web Real-Time Communication)
 * [1] https://www.privacytools.io/#webrtc ***/
user_pref("media.peerconnection.enabled", false);
user_pref("media.peerconnection.use_document_iceservers", false);
user_pref("media.peerconnection.video.enabled", false);
user_pref("media.peerconnection.identity.enabled", false);
user_pref("media.peerconnection.identity.timeout", 1);
user_pref("media.peerconnection.turn.disable", true);
user_pref("media.peerconnection.ice.tcp", false);
user_pref("media.navigator.video.enabled", false); // video capability for WebRTC
/* 2002: limit WebRTC IP leaks if using WebRTC
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1189041,1297416
 * [2] https://wiki.mozilla.org/Media/WebRTC/Privacy ***/
user_pref("media.peerconnection.ice.default_address_only", true); // [FF42-FF50]
user_pref("media.peerconnection.ice.no_host", true); // [FF51+]
/* 2010: disable WebGL (Web Graphics Library), force bare minimum feature set if used & disable WebGL extensions
 * [1] https://www.contextis.com/resources/blog/webgl-new-dimension-browser-exploitation/
 * [2] https://security.stackexchange.com/questions/13799/is-webgl-a-security-concern ***/
user_pref("webgl.disabled", true);
user_pref("pdfjs.enableWebGL", false);
user_pref("webgl.min_capability_mode", true);
user_pref("webgl.disable-extensions", true);
user_pref("webgl.disable-fail-if-major-performance-caveat", true);
/* 2012: disable two more webgl preferences [FF51+] ***/
user_pref("webgl.dxgl.enabled", false); // [WINDOWS]
user_pref("webgl.enable-webgl2", false);
/* 2022: disable screensharing ***/
user_pref("media.getusermedia.screensharing.enabled", false);
user_pref("media.getusermedia.browser.enabled", false);
user_pref("media.getusermedia.audiocapture.enabled", false);
/* 2024: set a default permission for Camera/Microphone [FF58+]
 * 0=always ask (default), 1=allow, 2=block
 * [SETTING] to add site exceptions: Page Info>Permissions>Use the Camera/Microphone
 * [SETTING] to manage site exceptions: Options>Privacy & Security>Permissions>Camera/Microphone>Settings ***/
   // user_pref("permissions.default.camera", 2);
   // user_pref("permissions.default.microphone", 2);
/* 2026: disable canvas capture stream [FF41+]
 * [1] https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/captureStream ***/
user_pref("canvas.capturestream.enabled", false);
/* 2027: disable camera image capture [FF35+]
 * [1] https://trac.torproject.org/projects/tor/ticket/16339 ***/
user_pref("dom.imagecapture.enabled", false); // [DEFAULT: false]
/* 2028: disable offscreen canvas [FF44+]
 * [1] https://developer.mozilla.org/docs/Web/API/OffscreenCanvas ***/
user_pref("gfx.offscreencanvas.enabled", false); // [DEFAULT: false]
/* 2030: disable auto-play of HTML5 media [FF63+]
 * 0=Allowed (default), 1=Blocked, 2=Prompt
 * [SETUP-WEB] This may break video playback on various sites ***/
user_pref("media.autoplay.default", 1);
/* 2031: disable audio auto-play in non-active tabs [FF51+]
 * [1] https://www.ghacks.net/2016/11/14/firefox-51-blocks-automatic-audio-playback-in-non-active-tabs/ ***/
user_pref("media.block-autoplay-until-in-foreground", true);

/*** [SECTION 2200]: WINDOW MEDDLING & LEAKS / POPUPS ***/
user_pref("_user.js.parrot", "2200 syntax error: the parrot's 'istory!");
/* 2201: prevent websites from disabling new window features
 * [1] http://kb.mozillazine.org/Prevent_websites_from_disabling_new_window_features ***/
user_pref("dom.disable_window_open_feature.close", true);
user_pref("dom.disable_window_open_feature.location", true); // [DEFAULT: true]
user_pref("dom.disable_window_open_feature.menubar", true);
user_pref("dom.disable_window_open_feature.minimizable", true);
user_pref("dom.disable_window_open_feature.personalbar", true); // bookmarks toolbar
user_pref("dom.disable_window_open_feature.resizable", true); // [DEFAULT: true]
user_pref("dom.disable_window_open_feature.status", true); // [DEFAULT: true]
user_pref("dom.disable_window_open_feature.titlebar", true);
user_pref("dom.disable_window_open_feature.toolbar", true);
/* 2202: prevent scripts moving and resizing open windows ***/
user_pref("dom.disable_window_move_resize", true);
/* 2203: open links targeting new windows in a new tab instead
 * This stops malicious window sizes and some screen resolution leaks.
 * You can still right-click a link and open in a new window.
 * [TEST] https://people.torproject.org/~gk/misc/entire_desktop.html
 * [1] https://trac.torproject.org/projects/tor/ticket/9881 ***/
user_pref("browser.link.open_newwindow", 3);
user_pref("browser.link.open_newwindow.restriction", 0);
/* 2204: disable Fullscreen API (requires user interaction) to prevent screen-resolution leaks
 * [NOTE] You can still manually toggle the browser's fullscreen state (F11),
 * but this pref will disable embedded video/game fullscreen controls, e.g. youtube
 * [TEST] https://developer.mozilla.org/samples/domref/fullscreen.html ***/
   // user_pref("full-screen-api.enabled", false);
/* 2210: block popup windows
 * [SETTING] Privacy & Security>Permissions>Block pop-up windows ***/
user_pref("dom.disable_open_during_load", true);
/* 2211: set max popups from a single non-click event - default is 20! ***/
user_pref("dom.popup_maximum", 3);
/* 2212: limit events that can cause a popup
 * default is "change click dblclick mouseup pointerup notificationclick reset submit touchend"
 * [1] http://kb.mozillazine.org/Dom.popup_allowed_events ***/
user_pref("dom.popup_allowed_events", "click dblclick");

/*** [SECTION 2300]: WEB WORKERS
     A worker is a JS "background task" running in a global context, i.e. it is different from
     the current window. Workers can spawn new workers (must be the same origin & scheme),
     including service and shared workers. Shared workers can be utilized by multiple scripts and
     communicate between browsing contexts (windows/tabs/iframes) and can even control your cache.

     [SETUP-WEB] Disabling "web workers" might break sites
     [UPDATE] uMatrix 1.2.0+ allows a per-scope control for workers (2301-deprecated) and service workers (2302)
              #Required reading [#] https://github.com/gorhill/uMatrix/releases/tag/1.2.0

     [1]    Web Workers: https://developer.mozilla.org/docs/Web/API/Web_Workers_API
     [2]         Worker: https://developer.mozilla.org/docs/Web/API/Worker
     [3] Service Worker: https://developer.mozilla.org/docs/Web/API/Service_Worker_API
     [4]   SharedWorker: https://developer.mozilla.org/docs/Web/API/SharedWorker
     [5]   ChromeWorker: https://developer.mozilla.org/docs/Web/API/ChromeWorker
     [6]  Notifications: https://support.mozilla.org/questions/1165867#answer-981820
***/
user_pref("_user.js.parrot", "2300 syntax error: the parrot's off the twig!");
/* 2302: disable service workers
 * Service workers essentially act as proxy servers that sit between web apps, and the browser
 * and network, are event driven, and can control the web page/site it is associated with,
 * intercepting and modifying navigation and resource requests, and caching resources.
 * [NOTE] Service worker APIs are hidden (in Firefox) and cannot be used when in PB mode.
 * [NOTE] Service workers only run over HTTPS. Service Workers have no DOM access. ***/
user_pref("dom.serviceWorkers.enabled", false);
/* 2304: disable web notifications
 * [1] https://developer.mozilla.org/docs/Web/API/Notifications_API ***/
user_pref("dom.webnotifications.enabled", false); // [FF22+]
user_pref("dom.webnotifications.serviceworker.enabled", false); // [FF44+]
/* 2305: set a default permission for Notifications (see 2304) [FF58+]
 * 0=always ask (default), 1=allow, 2=block
 * [NOTE] best left at default "always ask", fingerprintable via Permissions API
 * [SETTING] to add site exceptions: Page Info>Permissions>Receive Notifications
 * [SETTING] to manage site exceptions: Options>Privacy & Security>Permissions>Notifications>Settings ***/
   // user_pref("permissions.default.desktop-notification", 2);
/* 2306: disable push notifications [FF44+]
 * web apps can receive messages pushed to them from a server, whether or
 * not the web app is in the foreground, or even currently loaded
 * [1] https://developer.mozilla.org/docs/Web/API/Push_API ***/
user_pref("dom.push.enabled", false);
user_pref("dom.push.connection.enabled", false);
user_pref("dom.push.serverURL", "");
user_pref("dom.push.userAgentID", "");

/*** [SECTION 2400]: DOM (DOCUMENT OBJECT MODEL) & JAVASCRIPT ***/
user_pref("_user.js.parrot", "2400 syntax error: the parrot's kicked the bucket!");
/* 2401: disable website control over browser right-click context menu
 * [NOTE] Shift-Right-Click will always bring up the browser right-click context menu ***/
   // user_pref("dom.event.contextmenu.enabled", false);
/* 2402: disable website access to clipboard events/content
 * [SETUP-WEB] This will break some sites functionality such as pasting into facebook, wordpress
 * this applies to onCut, onCopy, onPaste events - i.e. you have to interact with
 * the website for it to look at the clipboard
 * [1] https://www.ghacks.net/2014/01/08/block-websites-reading-modifying-clipboard-contents-firefox/ ***/
user_pref("dom.event.clipboardevents.enabled", false);
/* 2403: disable clipboard commands (cut/copy) from "non-privileged" content [FF41+]
 * this disables document.execCommand("cut"/"copy") to protect your clipboard
 * [1] https://bugzilla.mozilla.org/1170911 ***/
user_pref("dom.allow_cut_copy", false); // [HIDDEN PREF]
/* 2404: disable "Confirm you want to leave" dialog on page close
 * Does not prevent JS leaks of the page close event.
 * [1] https://developer.mozilla.org/docs/Web/Events/beforeunload
 * [2] https://support.mozilla.org/questions/1043508 ***/
user_pref("dom.disable_beforeunload", true);
/* 2414: disable shaking the screen ***/
user_pref("dom.vibrator.enabled", false);
/* 2420: disable asm.js [FF22+]
 * [1] http://asmjs.org/
 * [2] https://www.mozilla.org/security/advisories/mfsa2015-29/
 * [3] https://www.mozilla.org/security/advisories/mfsa2015-50/
 * [4] https://www.mozilla.org/security/advisories/mfsa2017-01/#CVE-2017-5375
 * [5] https://www.mozilla.org/security/advisories/mfsa2017-05/#CVE-2017-5400
 * [6] https://rh0dev.github.io/blog/2017/the-return-of-the-jit/ ***/
user_pref("javascript.options.asmjs", false);
/* 2421: disable Ion and baseline JIT to help harden JS against exploits
 * [SETUP-PERF] If false, causes the odd site issue and there is also a performance loss
 * [1] https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-0817 ***/
   // user_pref("javascript.options.ion", false);
   // user_pref("javascript.options.baselinejit", false);
/* 2422: disable WebAssembly [FF52+]
 * [1] https://developer.mozilla.org/docs/WebAssembly ***/
user_pref("javascript.options.wasm", false);
/* 2426: disable Intersection Observer API [FF53+]
 * Almost a year to complete, three versions late to stable (as default false),
 * number #1 cause of crashes in nightly numerous times, and is (primarily) an
 * ad network API for "ad viewability checks" down to a pixel level
 * [1] https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API
 * [2] https://w3c.github.io/IntersectionObserver/
 * [3] https://bugzilla.mozilla.org/1243846 ***/
user_pref("dom.IntersectionObserver.enabled", false);
/* 2427: disable Shared Memory (Spectre mitigation)
 * [1] https://github.com/tc39/ecmascript_sharedmem/blob/master/TUTORIAL.md
 * [2] https://blog.mozilla.org/security/2018/01/03/mitigations-landing-new-class-timing-attack/ ***/
user_pref("javascript.options.shared_memory", false);
/* 2428: enforce DOMHighResTimeStamp API
 * [WARNING] Required for normalization of timestamps and any timer resolution mitigations ***/
user_pref("dom.event.highrestimestamp.enabled", true); // [DEFAULT: true]

/*** [SECTION 2500]: HARDWARE FINGERPRINTING ***/
user_pref("_user.js.parrot", "2500 syntax error: the parrot's shuffled off 'is mortal coil!");
/* 2502: disable Battery Status API
 * Initially a Linux issue (high precision readout) that was fixed.
 * However, it is still another metric for fingerprinting, used to raise entropy.
 * e.g. do you have a battery or not, current charging status, charge level, times remaining etc
 * [NOTE] From FF52+ Battery Status API is only available in chrome/privileged code. see [1]
 * [1] https://bugzilla.mozilla.org/1313580 ***/
   // user_pref("dom.battery.enabled", false);
/* 2504: disable virtual reality devices
 * Optional protection depending on your connected devices
 * [1] https://developer.mozilla.org/docs/Web/API/WebVR_API ***/
   // user_pref("dom.vr.enabled", false);
/* 2505: disable media device enumeration [FF29+]
 * [NOTE] media.peerconnection.enabled should also be set to false (see 2001)
 * [1] https://wiki.mozilla.org/Media/getUserMedia
 * [2] https://developer.mozilla.org/docs/Web/API/MediaDevices/enumerateDevices ***/
user_pref("media.navigator.enabled", false);
/* 2508: disable hardware acceleration to reduce graphics fingerprinting
 * [SETUP-PERF] Affects text rendering (fonts will look different), impacts video performance,
 * and parts of Quantum that utilize the GPU will also be affected as they are rolled out
 * [SETTING] General>Performance>Custom>Use hardware acceleration when available
 * [1] https://wiki.mozilla.org/Platform/GFX/HardwareAcceleration ***/
   // user_pref("gfx.direct2d.disabled", true); // [WINDOWS]
user_pref("layers.acceleration.disabled", true);
/* 2510: disable Web Audio API [FF51+]
 * [1] https://bugzilla.mozilla.org/1288359 ***/
user_pref("dom.webaudio.enabled", false);
/* 2516: disable PointerEvents
 * [1] https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent ***/
user_pref("dom.w3c_pointer_events.enabled", false);
/* 2517: disable Media Capabilities API [FF63+]
 * [SETUP-PERF] This *may* affect media performance if disabled, no one is sure
 * [1] https://github.com/WICG/media-capabilities
 * [2] https://wicg.github.io/media-capabilities/#security-privacy-considerations ***/
   // user_pref("media.media-capabilities.enabled", false);

/*** [SECTION 2600]: MISCELLANEOUS ***/
user_pref("_user.js.parrot", "2600 syntax error: the parrot's run down the curtain!");
/* 2601: prevent accessibility services from accessing your browser [RESTART]
 * [SETTING] Privacy & Security>Permissions>Prevent accessibility services from accessing your browser
 * [1] https://support.mozilla.org/kb/accessibility-services ***/
user_pref("accessibility.force_disabled", 1);
/* 2602: disable sending additional analytics to web servers
 * [1] https://developer.mozilla.org/docs/Web/API/Navigator/sendBeacon ***/
user_pref("beacon.enabled", false);
/* 2603: remove temp files opened with an external application
 * [1] https://bugzilla.mozilla.org/302433 ***/
user_pref("browser.helperApps.deleteTempFileOnExit", true);
/* 2604: disable page thumbnail collection
 * look in profile/thumbnails directory - you may want to clean that out ***/
user_pref("browser.pagethumbnails.capturing_disabled", true); // [HIDDEN PREF]
/* 2605: block web content in file processes [FF55+]
 * [SETUP-WEB] You may want to disable this for corporate or developer environments
 * [1] https://bugzilla.mozilla.org/1343184 ***/
user_pref("browser.tabs.remote.allowLinkedWebInFileUriProcess", false);
/* 2606: disable UITour backend so there is no chance that a remote page can use it ***/
user_pref("browser.uitour.enabled", false);
user_pref("browser.uitour.url", "");
/* 2607: disable various developer tools in browser context
 * [SETTING] Devtools>Advanced Settings>Enable browser chrome and add-on debugging toolboxes
 * [1] https://github.com/pyllyukko/user.js/issues/179#issuecomment-246468676 ***/
user_pref("devtools.chrome.enabled", false);
/* 2608: disable WebIDE to prevent remote debugging and extension downloads
 * [1] https://trac.torproject.org/projects/tor/ticket/16222 ***/
user_pref("devtools.webide.autoinstallADBHelper", false);
user_pref("devtools.debugger.remote-enabled", false);
user_pref("devtools.webide.enabled", false);
/* 2609: disable MathML (Mathematical Markup Language) [FF51+]
 * [TEST] http://browserspy.dk/mathml.php
 * [1] https://bugzilla.mozilla.org/1173199 ***/
user_pref("mathml.disabled", true);
/* 2610: disable in-content SVG (Scalable Vector Graphics) [FF53+]
 * [SETUP-WEB] Expect breakage incl. youtube player controls. Best left for a "hardened" profile.
 * [1] https://bugzilla.mozilla.org/1216893 ***/
   // user_pref("svg.disabled", true);
/* 2611: disable middle mouse click opening links from clipboard
 * [1] https://trac.torproject.org/projects/tor/ticket/10089
 * [2] http://kb.mozillazine.org/Middlemouse.contentLoadURL ***/
user_pref("middlemouse.contentLoadURL", false);
/* 2614: limit HTTP redirects (this does not control redirects with HTML meta tags or JS)
 * [NOTE] A low setting of 5 or under will probably break some sites (e.g. gmail logins)
 * To control HTML Meta tag and JS redirects, use an extension. Default is 20 ***/
user_pref("network.http.redirection-limit", 10);
/* 2615: disable websites overriding Firefox's keyboard shortcuts [FF58+]
 * 0= (default), 1=allow, 2=block
 * [NOTE] At the time of writing, causes issues with delete and backspace keys
 * [SETTING] to add site exceptions: Page Info>Permissions>Override Keyboard Shortcuts ***/
   // user_pref("permissions.default.shortcuts", 2);
/* 2616: remove special permissions for certain mozilla domains [FF35+]
 * [1] resource://app/defaults/permissions ***/
user_pref("permissions.manager.defaultsUrl", "");
/* 2617: remove webchannel whitelist ***/
user_pref("webchannel.allowObject.urlWhitelist", "");
/* 2618: disable exposure of system colors to CSS or canvas [FF44+]
 * [NOTE] see second listed bug: may cause black on black for elements with undefined colors
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=232227,1330876 ***/
user_pref("ui.use_standins_for_native_colors", true); // [HIDDEN PREF]
/* 2619: enforce Punycode for Internationalized Domain Names to eliminate possible spoofing
 * Firefox has *some* protections, but it is better to be safe than sorry. The downside: it will also
 * display legitimate IDN's punycoded, which might be undesirable for users of non-latin alphabets
 * [TEST] https://www.xn--80ak6aa92e.com/ (www.apple.com)
 * [1] https://wiki.mozilla.org/IDN_Display_Algorithm
 * [2] https://en.wikipedia.org/wiki/IDN_homograph_attack
 * [3] CVE-2017-5383: https://www.mozilla.org/security/advisories/mfsa2017-02/
 * [4] https://www.xudongz.com/blog/2017/idn-phishing/ ***/
user_pref("network.IDN_show_punycode", true);
/* 2620: enable Firefox's built-in PDF reader
 * This setting controls if the option "Display in Firefox" in the above setting is available
 *   and by effect controls whether PDFs are handled in-browser or externally ("Ask" or "Open With")
 * PROS: pdfjs is lightweight, open source, and as secure/vetted as any pdf reader out there (more than most)
 *   Exploits are rare (1 serious case in 4 yrs), treated seriously and patched quickly.
 *   It doesn't break "state separation" of browser content (by not sharing with OS, independent apps).
 *   It maintains disk avoidance and application data isolation. It's convenient. You can still save to disk.
 * CONS: You may prefer a different pdf reader for security reasons
 * CAVEAT: JS can still force a pdf to open in-browser by bundling its own code (rare)
 * [SETTING] General>Applications>Portable Document Format (PDF) ***/
user_pref("pdfjs.disabled", false);

/** DOWNLOADS ***/
/* 2650: discourage downloading to desktop (0=desktop 1=downloads 2=last used)
 * [SETTING] To set your default "downloads": General>Downloads>Save files to ***/
user_pref("browser.download.folderList", 2);
/* 2651: enforce user interaction for security by always asking the user where to download
 * [SETTING] General>Downloads>Always ask you where to save files ***/
user_pref("browser.download.useDownloadDir", false);
/* 2652: disable adding downloads to the system's "recent documents" list ***/
user_pref("browser.download.manager.addToRecentDocs", false);
/* 2653: disable hiding mime types (Options>General>Applications) not associated with a plugin ***/
user_pref("browser.download.hide_plugins_without_extensions", false);
/* 2654: disable "open with" in download dialog [FF50+]
 * This is very useful to enable when the browser is sandboxed (e.g. via AppArmor)
 * in such a way that it is forbidden to run external applications.
 * [SETUP-CHROME] This may interfere with some users' workflow or methods
 * [1] https://bugzilla.mozilla.org/1281959 ***/
user_pref("browser.download.forbid_open_with", true);

/** EXTENSIONS ***/
/* 2660: lock down allowed extension directories
 * [SETUP-CHROME] This will break extensions that do not use the default XPI directories
 * [1] https://mike.kaply.com/2012/02/21/understanding-add-on-scopes/
 * [1] archived: https://archive.is/DYjAM ***/
user_pref("extensions.enabledScopes", 1); // [HIDDEN PREF]
user_pref("extensions.autoDisableScopes", 15);
/* 2662: disable webextension restrictions on certain mozilla domains (also see 4503) [FF60+]
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1384330,1406795,1415644,1453988 ***/
   // user_pref("extensions.webextensions.restrictedDomains", "");
/* 2663: enable warning when websites try to install add-ons
 * [SETTING] Privacy & Security>Permissions>Warn you when websites try to install add-ons ***/
user_pref("xpinstall.whitelist.required", true); // [DEFAULT: true]

/** SECURITY ***/
/* 2680: enable CSP (Content Security Policy)
 * [1] https://developer.mozilla.org/docs/Web/HTTP/CSP ***/
user_pref("security.csp.enable", true); // [DEFAULT: true]
/* 2681: disable CSP violation events [FF59+]
 * [1] https://developer.mozilla.org/docs/Web/API/SecurityPolicyViolationEvent ***/
user_pref("security.csp.enable_violation_events", false);
/* 2682: enable CSP 1.1 experimental hash-source directive [FF44+]
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=855326,883975 ***/
user_pref("security.csp.experimentalEnabled", true);
/* 2683: block top level window data: URIs [FF56+]
 * [1] https://bugzilla.mozilla.org/1331351
 * [2] https://www.wordfence.com/blog/2017/01/gmail-phishing-data-uri/
 * [3] https://www.fxsitecompat.com/en-CA/docs/2017/data-url-navigations-on-top-level-window-will-be-blocked/ ***/
user_pref("security.data_uri.block_toplevel_data_uri_navigations", true); // [DEFAULT: true]
/* 2684: enforce a security delay on some confirmation dialogs such as install, open/save
 * [1] http://kb.mozillazine.org/Disable_extension_install_delay_-_Firefox
 * [2] https://www.squarefree.com/2004/07/01/race-conditions-in-security-dialogs/ ***/
user_pref("security.dialog_enable_delay", 700);

/*** [SECTION 2700]: PERSISTENT STORAGE
     Data SET by websites including
            cookies : profile\cookies.sqlite
       localStorage : profile\webappsstore.sqlite
          indexedDB : profile\storage\default
           appCache : profile\OfflineCache
     serviceWorkers :
***/
user_pref("_user.js.parrot", "2700 syntax error: the parrot's joined the bleedin' choir invisible!");
/* 2701: disable 3rd-party cookies and site-data
 * You can set exceptions under site permissions or use an extension
 * 0=Accept cookies and site data, 1=Block third-party cookies, 2=Block all cookies,
 * 3=Block cookies from unvisited sites, 4=Block third-party trackers (FF63+)
 * [NOTE] value 4 is tied to the Tracking Protection lists so make sure you have 0424 + 0425 on default values!
 * [NOTE] Blocking 3rd party controls 3rd party access to localStorage, IndexedDB, Cache API and Service Worker Cache.
 * Blocking 1st party controls access to localStorage and IndexedDB (note: Service Workers can still use IndexedDB).
 * [SETTING] Privacy & Security>Cookies and Site Data>Type blocked
 * [1] https://www.fxsitecompat.com/en-CA/docs/2015/web-storage-indexeddb-cache-api-now-obey-third-party-cookies-preference/ ***/
user_pref("network.cookie.cookieBehavior", 1);
/* 2702: set third-party cookies (i.e ALL) (if enabled, see 2701) to session-only
   and (FF58+) set third-party non-secure (i.e HTTP) cookies to session-only
   [NOTE] .sessionOnly overrides .nonsecureSessionOnly except when .sessionOnly=false and
   .nonsecureSessionOnly=true. This allows you to keep HTTPS cookies, but session-only HTTP ones
 * [1] https://feeding.cloud.geek.nz/posts/tweaking-cookies-for-privacy-in-firefox/
 * [2] http://kb.mozillazine.org/Network.cookie.thirdparty.sessionOnly ***/
user_pref("network.cookie.thirdparty.sessionOnly", true);
user_pref("network.cookie.thirdparty.nonsecureSessionOnly", true); // [FF58+]
/* 2703: set cookie lifetime policy
 * 0=until they expire (default), 2=until you close Firefox
 * [NOTE] 3=for n days : no longer supported in FF63+ (see 2704-deprecated)
 * [SETTING] Privacy & Security>Cookies and Site Data>Keep until... ***/
   // user_pref("network.cookie.lifetimePolicy", 0);
/* 2705: disable HTTP sites setting cookies with the "secure" directive [FF52+]
 * [1] https://developer.mozilla.org/Firefox/Releases/52#HTTP ***/
user_pref("network.cookie.leave-secure-alone", true); // [DEFAULT: true]
/* 2706: enable support for same-site cookies [FF60+]
 * [1] https://bugzilla.mozilla.org/795346
 * [2] https://blog.mozilla.org/security/2018/04/24/same-site-cookies-in-firefox-60/
 * [3] https://www.sjoerdlangkemper.nl/2016/04/14/preventing-csrf-with-samesite-cookie-attribute/ ***/
   // user_pref("network.cookie.same-site.enabled", true); // [DEFAULT: true]
/* 2710: disable DOM (Document Object Model) Storage
 * [WARNING] This will break a LOT of sites' functionality AND extensions!
 * You are better off using an extension for more granular control ***/
   // user_pref("dom.storage.enabled", false);
/* 2720: enforce IndexedDB (IDB) as enabled
 * IDB is required for extensions and Firefox internals (even before FF63 in [1])
 * To control *website* IDB data, control allowing cookies and service workers, or use
 * Temporary Containers. To mitigate *website* IDB, FPI helps (4001), and/or sanitize
 * on close (Offline Website Data, see 2800) or on-demand (Ctrl-Shift-Del), or automatically
 * via an extenion. Note that IDB currently cannot be sanitized by host.
 * [1] https://blog.mozilla.org/addons/2018/08/03/new-backend-for-storage-local-api/ ***/
user_pref("dom.indexedDB.enabled", true); // [DEFAULT: true]
/* 2730: disable offline cache ***/
user_pref("browser.cache.offline.enable", false);
/* 2730b: disable offline cache on insecure sites [FF60+]
 * [1] https://blog.mozilla.org/security/2018/02/12/restricting-appcache-secure-contexts/ ***/
user_pref("browser.cache.offline.insecure.enable", false); // [DEFAULT: false in FF62+]
/* 2731: enforce websites to ask to store data for offline use
 * [1] https://support.mozilla.org/questions/1098540
 * [2] https://bugzilla.mozilla.org/959985 ***/
user_pref("offline-apps.allow_by_default", false);
/* 2740: disable service workers cache and cache storage
 * [1] https://w3c.github.io/ServiceWorker/#privacy ***/
user_pref("dom.caches.enabled", false);
/* 2750: disable Storage API [FF51+]
 * The API gives sites the ability to find out how much space they can use, how much
 * they are already using, and even control whether or not they need to be alerted
 * before the user agent disposes of site data in order to make room for other things.
 * [1] https://developer.mozilla.org/docs/Web/API/StorageManager
 * [2] https://developer.mozilla.org/docs/Web/API/Storage_API
 * [3] https://blog.mozilla.org/l10n/2017/03/07/firefox-l10n-report-aurora-54/ ***/
   // user_pref("dom.storageManager.enabled", false);

/*** [SECTION 2800]: SHUTDOWN [SETUP-CHROME]
     You should set the values to what suits you best.
     - "Offline Website Data" includes appCache (2730), localStorage (2710),
       Service Worker cache (2740), and QuotaManager (IndexedDB (2720), asm-cache)
     - In both 2803 + 2804, the 'download' and 'history' prefs are combined in the
       Firefox interface as "Browsing & Download History" and their values will be synced
***/
user_pref("_user.js.parrot", "2800 syntax error: the parrot's bleedin' demised!");
/* 2802: enable Firefox to clear history items on shutdown
 * [SETTING] Privacy & Security>History>Custom Settings>Clear history when Firefox closes ***/
user_pref("privacy.sanitize.sanitizeOnShutdown", true);
/* 2803: set what history items to clear on shutdown
 * [NOTE] If 'history' is true, downloads will also be cleared regardless of the value
 * but if 'history' is false, downloads can still be cleared independently
 * However, this may not always be the case. The interface combines and syncs these
 * prefs when set from there, and the sanitize code may change at any time
 * [SETTING] Privacy & Security>History>Custom Settings>Clear history when Firefox closes>Settings ***/
user_pref("privacy.clearOnShutdown.cache", true);
user_pref("privacy.clearOnShutdown.cookies", true);
user_pref("privacy.clearOnShutdown.downloads", true); // see note above
user_pref("privacy.clearOnShutdown.formdata", true); // Form & Search History
user_pref("privacy.clearOnShutdown.history", true); // Browsing & Download History
user_pref("privacy.clearOnShutdown.offlineApps", true); // Offline Website Data
user_pref("privacy.clearOnShutdown.sessions", true); // Active Logins
user_pref("privacy.clearOnShutdown.siteSettings", false); // Site Preferences
/* 2804: reset default history items to clear with Ctrl-Shift-Del (to match above)
 * This dialog can also be accessed from the menu History>Clear Recent History
 * Firefox remembers your last choices. This will reset them when you start Firefox.
 * [NOTE] Regardless of what you set privacy.cpd.downloads to, as soon as the dialog
 * for "Clear Recent History" is opened, it is synced to the same as 'history' ***/
user_pref("privacy.cpd.cache", true);
user_pref("privacy.cpd.cookies", true);
   // user_pref("privacy.cpd.downloads", true); // not used, see note above
user_pref("privacy.cpd.formdata", true); // Form & Search History
user_pref("privacy.cpd.history", true); // Browsing & Download History
user_pref("privacy.cpd.offlineApps", true); // Offline Website Data
user_pref("privacy.cpd.passwords", false); // this is not listed
user_pref("privacy.cpd.sessions", true); // Active Logins
user_pref("privacy.cpd.siteSettings", false); // Site Preferences
/* 2805: privacy.*.openWindows (clear session restore data) [FF34+]
 * [NOTE] There is a years-old bug that these cause two windows when Firefox restarts.
 * You do not need these anyway if session restore is cleared with history (see 2803) ***/
   // user_pref("privacy.clearOnShutdown.openWindows", true);
   // user_pref("privacy.cpd.openWindows", true);
/* 2806: reset default 'Time range to clear' for 'Clear Recent History' (see 2804)
 * Firefox remembers your last choice. This will reset the value when you start Firefox.
 * 0=everything, 1=last hour, 2=last two hours, 3=last four hours,
 * 4=today, 5=last five minutes, 6=last twenty-four hours
 * [NOTE] The values 5 + 6 are not listed in the dropdown, which will display a
 * blank value if they are used, but they do work as advertised ***/
user_pref("privacy.sanitize.timeSpan", 0);

/*** [SECTION 4000]: FPI (FIRST PARTY ISOLATION)
 ** 1278037 - isolate indexedDB (FF51+)
 ** 1277803 - isolate favicons (FF52+)
 ** 1264562 - isolate OCSP cache (FF52+)
 ** 1268726 - isolate Shared Workers (FF52+)
 ** 1316283 - isolate SSL session cache (FF52+)
 ** 1317927 - isolate media cache (FF53+)
 ** 1323644 - isolate HSTS and HPKP (FF54+)
 ** 1334690 - isolate HTTP Alternative Services (FF54+)
 ** 1334693 - isolate SPDY/HTTP2 (FF55+)
 ** 1337893 - isolate DNS cache (FF55+)
 ** 1344170 - isolate blob: URI (FF55+)
 ** 1300671 - isolate data:, about: URLs (FF55+)
 ** 1473247 - isolate IP addresses (FF63+)
 ** 1492607 - isolate postMessage with targetOrigin "*" (requires 4002) (FF65+)

 NOTE: FPI has some issues depending on your Firefox release
 ** 1418931 - [fixed in FF58+] IndexedDB (Offline Website Data) with FPI Origin Attributes
      are not removed with "Clear All/Recent History" or "On Close"
 ** 1381197 - [fixed in FF59+] extensions cannot control cookies with FPI Origin Attributes
***/
user_pref("_user.js.parrot", "4000 syntax error: the parrot's pegged out");
/* 4001: enable First Party Isolation [FF51+]
 * [SETUP-WEB] May break cross-domain logins and site functionality until perfected
 * [1] https://bugzilla.mozilla.org/1260931 ***/
user_pref("privacy.firstparty.isolate", true);
/* 4002: enforce FPI restriction for window.opener [FF54+]
 * [NOTE] Setting this to false may reduce the breakage in 4001
 * FF65+ blocks postMessage with targetOrigin "*" if originAttributes don't match. But
 * to reduce breakage it ignores the 1st-party domain (FPD) originAttribute. (see [2],[3])
 * The 2nd pref removes that limitation and will only allow communication if FPDs also match.
 * [1] https://bugzilla.mozilla.org/1319773#c22
 * [2] https://bugzilla.mozilla.org/1492607
 * [3] https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage ***/
user_pref("privacy.firstparty.isolate.restrict_opener_access", true); // [DEFAULT: true]
   // user_pref("privacy.firstparty.isolate.block_post_message", true); // [HIDDEN PREF]

/*** [SECTION 4500]: RFP (RESIST FINGERPRINTING)
   This master switch will be used for a wide range of items, many of which will
   **override** existing prefs from FF55+, often providing a **better** solution

   IMPORTANT: As existing prefs become redundant, and some of them WILL interfere
   with how RFP works, they will be moved to section 4600 and made inactive

 ** 418986 - limit window.screen & CSS media queries leaking identifiable info (FF41+)
      [POC] http://ip-check.info/?lang=en (screen, usable screen, and browser window will match)
      [NOTE] Does not cover everything yet - https://bugzilla.mozilla.org/1216800
      [NOTE] This will probably make your values pretty unique until you resize or snap the
      inner window width + height into standard/common resolutions (such as 1366x768)
      To set a size, open a XUL (chrome) page (such as about:config) which is at 100% zoom, hit
      Shift+F4 to open the scratchpad, type window.resizeTo(1366,768), hit Ctrl+R to run. Test
      your window size, do some math, resize to allow for all the non inner window elements
      [TEST] http://browserspy.dk/screen.php
 ** 1281949 - spoof screen orientation (FF50+)
 ** 1281963 - hide the contents of navigator.plugins and navigator.mimeTypes (FF50+)
      FF53: Fixes GetSupportedNames in nsMimeTypeArray and nsPluginArray (1324044)
 ** 1330890 - spoof timezone as UTC 0 (FF55+)
      FF58: Date.toLocaleFormat deprecated (818634)
      FF60: Date.toLocaleDateString and Intl.DateTimeFormat fixed (1409973)
 ** 1360039 - spoof navigator.hardwareConcurrency as 2 (see 4601) (FF55+)
      This spoof *shouldn't* affect core chrome/Firefox performance
 ** 1217238 - reduce precision of time exposed by javascript (FF55+)
 ** 1369303 - spoof/disable performance API (see 2410-deprecated, 4602, 4603) (FF56+)
 ** 1333651 & 1383495 & 1396468 - spoof Navigator API (see section 4700) (FF56+)
      FF56: The version number will be rounded down to the nearest multiple of 10
      FF57: The version number will match current ESR (1393283, 1418672, 1418162)
      FF59: The OS will be reported as Windows, OSX, Android, or Linux (to reduce breakage) (1404608)
 ** 1369319 - disable device sensor API (see 4604) (FF56+)
 ** 1369357 - disable site specific zoom (see 4605) (FF56+)
 ** 1337161 - hide gamepads from content (see 4606) (FF56+)
 ** 1372072 - spoof network information API as "unknown" (see 4607) (FF56+)
 ** 1333641 - reduce fingerprinting in WebSpeech API (see 4608) (FF56+)
 ** 1372069 & 1403813 & 1441295 - block geolocation requests (same as denying a site permission) (see 0201, 0201b) (FF56-62)
 ** 1369309 - spoof media statistics (see 4610) (FF57+)
 ** 1382499 - reduce screen co-ordinate fingerprinting in Touch API (see 4611) (FF57+)
 ** 1217290 & 1409677 - enable fingerprinting resistance for WebGL (see 2010-12) (FF57+)
 ** 1382545 - reduce fingerprinting in Animation API (FF57+)
 ** 1354633 - limit MediaError.message to a whitelist (FF57+)
 ** 1382533 - enable fingerprinting resistance for Presentation API (FF57+)
      This blocks exposure of local IP Addresses via mDNS (Multicast DNS)
 **  967895 - enable site permission prompt before allowing canvas data extraction (FF58+)
      FF59: Added to site permissions panel (1413780) Only prompt when triggered by user input (1376865)
 ** 1372073 - spoof/block fingerprinting in MediaDevices API (see 4612) (FF59+)
 ** 1039069 - warn when language prefs are set to non en-US (see 0207, 0208) (FF59+)
 ** 1222285 & 1433592 - spoof keyboard events and suppress keyboard modifier events (FF59+)
      Spoofing mimics the content language of the document. Currently it only supports en-US.
      Modifier events suppressed are SHIFT and both ALT keys. Chrome is not affected.
      FF60: Fix keydown/keyup events (1438795)
 ** 1337157 - disable WebGL debug renderer info (see 4613) (FF60+)
 ** 1459089 - disable OS locale in HTTP Accept-Language headers (ANDROID) (FF62+)
 ** 1363508 - spoof/suppress Pointer Events (see 2516) (FF64+)
      FF65: pointerEvent.pointerid (1492766)
***/
user_pref("_user.js.parrot", "4500 syntax error: the parrot's popped 'is clogs");
/* 4501: enable privacy.resistFingerprinting [FF41+]
 * [SETUP-WEB] RFP is not ready for the masses, so expect some website breakage
 * [1] https://bugzilla.mozilla.org/418986 ***/
user_pref("privacy.resistFingerprinting", true);
/* 4502: set new window sizes to round to hundreds [FF55+]
 * [SETUP-CHROME] Width will round down to multiples of 200s and height to 100s, to fit your screen.
 * The override values are a starting point to round from if you want some control
 * [1] https://bugzilla.mozilla.org/1330882
 * [2] https://hardware.metrics.mozilla.com/ ***/
   // user_pref("privacy.window.maxInnerWidth", 1600); // [HIDDEN PREF]
   // user_pref("privacy.window.maxInnerHeight", 900); // [HIDDEN PREF]
/* 4503: disable mozAddonManager Web API [FF57+]
 * [NOTE] As a side-effect in FF57-59 this allowed extensions to work on AMO. In FF60+ you also need
 * to sanitize or clear extensions.webextensions.restrictedDomains (see 2662) to keep that side-effect
 * [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1384330,1406795,1415644,1453988 ***/
user_pref("privacy.resistFingerprinting.block_mozAddonManager", true); // [HIDDEN PREF]
/* 4504: disable showing about:blank as soon as possible during startup [FF60+]
 * When default true (FF62+) this no longer masks the RFP resizing activity
 * [1] https://bugzilla.mozilla.org/1448423 ***/
user_pref("browser.startup.blankWindow", false);

/*** [SECTION 4600]: RFP ALTERNATIVES
   * IF you DO use RFP (see 4500) then you DO NOT need these redundant prefs. In fact,
     some even cause RFP to not behave as you would expect and alter your fingerprint.
     Make sure they are RESET in about:config as per your Firefox version
   * IF you DO NOT use RFP or are on ESR... then turn on each ESR section below
***/
user_pref("_user.js.parrot", "4600 syntax error: the parrot's crossed the Jordan");
/* [SETUP-non-RFP] Non-RFP users replace the * with a slash on this line to enable these
// FF55+
// 4601: [2514] spoof (or limit?) number of CPU cores [FF48+]
   // [NOTE] *may* affect core chrome/Firefox performance, will affect content.
   // [1] https://bugzilla.mozilla.org/1008453
   // [2] https://trac.torproject.org/projects/tor/ticket/21675
   // [3] https://trac.torproject.org/projects/tor/ticket/22127
   // [4] https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency
   // user_pref("dom.maxHardwareConcurrency", 2);
// * * * /
// FF56+
// 4602: [2411] disable resource/navigation timing
user_pref("dom.enable_resource_timing", false);
// 4603: [2412] disable timing attacks
   // [1] https://wiki.mozilla.org/Security/Reviews/Firefox/NavigationTimingAPI
user_pref("dom.enable_performance", false);
// 4604: [2512] disable device sensor API
   // Optional protection depending on your device
   // [1] https://trac.torproject.org/projects/tor/ticket/15758
   // [2] https://blog.lukaszolejnik.com/stealing-sensitive-browser-data-with-the-w3c-ambient-light-sensor-api/
   // [3] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1357733,1292751
   // user_pref("device.sensors.enabled", false);
// 4605: [2515] disable site specific zoom
   // Zoom levels affect screen res and are highly fingerprintable. This does not stop you using
   // zoom, it will just not use/remember any site specific settings. Zoom levels on new tabs
   // and new windows are reset to default and only the current tab retains the current zoom
user_pref("browser.zoom.siteSpecific", false);
// 4606: [2501] disable gamepad API - USB device ID enumeration
   // Optional protection depending on your connected devices
   // [1] https://trac.torproject.org/projects/tor/ticket/13023
   // user_pref("dom.gamepad.enabled", false);
// 4607: [2503] disable giving away network info [FF31+]
   // e.g. bluetooth, cellular, ethernet, wifi, wimax, other, mixed, unknown, none
   // [1] https://developer.mozilla.org/docs/Web/API/Network_Information_API
   // [2] https://wicg.github.io/netinfo/
   // [3] https://bugzilla.mozilla.org/960426
user_pref("dom.netinfo.enabled", false);
// 4608: [2021] disable the SpeechSynthesis (Text-to-Speech) part of the Web Speech API
   // [1] https://developer.mozilla.org/docs/Web/API/Web_Speech_API
   // [2] https://developer.mozilla.org/docs/Web/API/SpeechSynthesis
   // [3] https://wiki.mozilla.org/HTML5_Speech_API
user_pref("media.webspeech.synth.enabled", false);
// * * * /
// FF57+
// 4610: [2506] disable video statistics - JS performance fingerprinting [FF25+]
   // [1] https://trac.torproject.org/projects/tor/ticket/15757
   // [2] https://bugzilla.mozilla.org/654550
user_pref("media.video_stats.enabled", false);
// 4611: [2509] disable touch events
   // fingerprinting attack vector - leaks screen res & actual screen coordinates
   // 0=disabled, 1=enabled, 2=autodetect
   // Optional protection depending on your device
   // [1] https://developer.mozilla.org/docs/Web/API/Touch_events
   // [2] https://trac.torproject.org/projects/tor/ticket/10286
   // user_pref("dom.w3c_touch_events.enabled", 0);
// * * * /
// FF59+
// 4612: [2511] disable MediaDevices change detection [FF51+]
   // [1] https://developer.mozilla.org/docs/Web/Events/devicechange
   // [2] https://developer.mozilla.org/docs/Web/API/MediaDevices/ondevicechange
user_pref("media.ondevicechange.enabled", false);
// * * * /
// FF60+
// 4613: [2011] disable WebGL debug info being available to websites
   // [1] https://bugzilla.mozilla.org/1171228
   // [2] https://developer.mozilla.org/docs/Web/API/WEBGL_debug_renderer_info
user_pref("webgl.enable-debug-renderer-info", false);
// * * * /
// ***/

/*** [SECTION 4700]: RFP ALTERNATIVES (NAVIGATOR / USER AGENT (UA) SPOOFING)
     This is FYI ONLY. These prefs are INSUFFICIENT(a) on their own, you need
     to use RFP (4500) or an extension, in which case they become POINTLESS.
     (a) Many of the components that make up your UA can be derived by other means.
         And when those values differ, you provide more bits and raise entropy.
         Examples of leaks include navigator objects, date locale/formats, iframes,
         headers, tcp/ip attributes, feature detection, and **many** more.
     ALL values below intentionally left blank - use RFP, or get a vetted, tested
         extension and mimic RFP values to *lower* entropy, or randomize to *raise* it
***/
user_pref("_user.js.parrot", "4700 syntax error: the parrot's taken 'is last bow");
/* 4701: navigator.userAgent ***/
   // user_pref("general.useragent.override", ""); // [HIDDEN PREF]
/* 4702: navigator.buildID
 * Revealed build time down to the second. In FF64+ it now returns a fixed timestamp
 * [1] https://bugzilla.mozilla.org/583181
 * [2] https://www.fxsitecompat.com/en-CA/docs/2018/navigator-buildid-now-returns-a-fixed-timestamp/ ***/
   // user_pref("general.buildID.override", ""); // [HIDDEN PREF]
/* 4703: navigator.appName ***/
   // user_pref("general.appname.override", ""); // [HIDDEN PREF]
/* 4704: navigator.appVersion ***/
   // user_pref("general.appversion.override", ""); // [HIDDEN PREF]
/* 4705: navigator.platform ***/
   // user_pref("general.platform.override", ""); // [HIDDEN PREF]
/* 4706: navigator.oscpu ***/
   // user_pref("general.oscpu.override", ""); // [HIDDEN PREF]

/*** [SECTION 5000]: PERSONAL
     Non-project related but useful. If any of these interest you, add them to your overrides ***/
user_pref("_user.js.parrot", "5000 syntax error: this is an ex-parrot!");
/* WELCOME & WHAT's NEW NOTICES ***/
   // user_pref("browser.startup.homepage_override.mstone", "ignore"); // master switch
   // user_pref("startup.homepage_welcome_url", "");
   // user_pref("startup.homepage_welcome_url.additional", "");
   // user_pref("startup.homepage_override_url", ""); // What's New page after updates
/* WARNINGS ***/
   // user_pref("browser.tabs.warnOnClose", false);
   // user_pref("browser.tabs.warnOnCloseOtherTabs", false);
   // user_pref("browser.tabs.warnOnOpen", false);
   // user_pref("full-screen-api.warning.delay", 0);
   // user_pref("full-screen-api.warning.timeout", 0);
   // user_pref("general.warnOnAboutConfig", false);
/* APPEARANCE ***/
   // user_pref("browser.download.autohideButton", false); // [FF57+]
   // user_pref("toolkit.cosmeticAnimations.enabled", false); // [FF55+]
/* CONTENT BEHAVIOR ***/
   // user_pref("accessibility.typeaheadfind", true); // enable "Find As You Type"
   // user_pref("clipboard.autocopy", false); // disable autocopy default [LINUX]
   // user_pref("layout.spellcheckDefault", 2); // 0=none, 1-multi-line, 2=multi-line & single-line
/* UX BEHAVIOR ***/
   // user_pref("browser.backspace_action", 2); // 0=previous page, 1=scroll up, 2=do nothing
   // user_pref("browser.tabs.closeWindowWithLastTab", false);
   // user_pref("browser.tabs.loadBookmarksInTabs", true); // open bookmarks in a new tab [FF57+]
   // user_pref("browser.urlbar.decodeURLsOnCopy", true); // see Bugzilla 1320061 [FF53+]
   // user_pref("general.autoScroll", false); // middle-click enabling auto-scrolling [WINDOWS] [MAC]
   // user_pref("ui.key.menuAccessKey", 0); // disable alt key toggling the menu bar [RESTART]
/* OTHER ***/
   // user_pref("browser.bookmarks.max_backups", 2);
   // user_pref("identity.fxaccounts.enabled", false); // disable and hide Firefox Accounts and Sync [FF60+] [RESTART]
   // user_pref("network.manage-offline-status", false); // see Bugzilla 620472
   // user_pref("reader.parse-on-load.enabled", false); // "Reader View"
   // user_pref("xpinstall.signatures.required", false); // enforced extension signing (Nightly/ESR)

/*** [SECTION 9999]: DEPRECATED / REMOVED / LEGACY / RENAMED
     Documentation denoted as [-]. Numbers may be re-used. See [1] for a link-clickable,
     viewer-friendly version of the deprecated bugzilla tickets. The original state of each pref
     has been preserved, or changed to match the current setup, but you are advised to review them.
     [NOTE] Up to FF53, to enable a section change /* FFxx to // FFxx
     For FF53 on, we have bundled releases to cater for ESR. Change /* to // on the first line
     [1] https://github.com/ghacksuserjs/ghacks-user.js/issues/123
***/
user_pref("_user.js.parrot", "9999 syntax error: the parrot's deprecated!");
/* FF42 and older
// 2604: (25+) disable page thumbnails - replaced by browser.pagethumbnails.capturing_disabled
   // [-] https://bugzilla.mozilla.org/897811
user_pref("pageThumbs.enabled", false);
// 2503: (31+) disable network API - replaced by dom.netinfo.enabled
   // [-] https://bugzilla.mozilla.org/960426
user_pref("dom.network.enabled", false);
// 2600's: (35+) disable WebSockets
   // [-] https://bugzilla.mozilla.org/1091016
user_pref("network.websocket.enabled", false);
// 1610: (36+) set DNT "value" to "not be tracked" [FF21+]
   // [1] http://kb.mozillazine.org/Privacy.donottrackheader.value
   // [-] https://bugzilla.mozilla.org/1042135#c101
   // user_pref("privacy.donottrackheader.value", 1);
// 2023: (37+) disable camera autofocus callback
   // The API will be superseded by the WebRTC Capture and Stream API
   // [1] https://developer.mozilla.org/docs/Archive/B2G_OS/API/CameraControl
   // [-] https://bugzilla.mozilla.org/1107683
user_pref("camera.control.autofocus_moving_callback.enabled", false);
// 0415: (41+) disable reporting URLs (safe browsing) - removed or replaced by various
   // [-] https://bugzilla.mozilla.org/1109475
user_pref("browser.safebrowsing.reportErrorURL", ""); // browser.safebrowsing.reportPhishMistakeURL
user_pref("browser.safebrowsing.reportGenericURL", ""); // removed
user_pref("browser.safebrowsing.reportMalwareErrorURL", ""); // browser.safebrowsing.reportMalwareMistakeURL
user_pref("browser.safebrowsing.reportMalwareURL", ""); // removed
user_pref("browser.safebrowsing.reportURL", ""); // removed
// 0702: (41+) disable HTTP2 (draft)
   // [-] https://bugzilla.mozilla.org/1132357
user_pref("network.http.spdy.enabled.http2draft", false);
// 1804: (41+) disable plugin enumeration
   // [-] https://bugzilla.mozilla.org/1169945
user_pref("plugins.enumerable_names", "");
// 2803: (42+) clear passwords on shutdown
   // [-] https://bugzilla.mozilla.org/1102184
   // user_pref("privacy.clearOnShutdown.passwords", false);
// 5002: (42+) disable warning when a domain requests full screen
   // replaced by setting full-screen-api.warning.timeout to zero
   // [-] https://bugzilla.mozilla.org/1160017
   // user_pref("full-screen-api.approval-required", false);
// ***/
/* FF43
// 0410's: disable safebrowsing urls & updates - replaced by various
   // [-] https://bugzilla.mozilla.org/1107372
   // user_pref("browser.safebrowsing.gethashURL", ""); // browser.safebrowsing.provider.google.gethashURL
   // user_pref("browser.safebrowsing.updateURL", ""); // browser.safebrowsing.provider.google.updateURL
user_pref("browser.safebrowsing.malware.reportURL", ""); // browser.safebrowsing.provider.google.reportURL
// 0420's: disable tracking protection - replaced by various
   // [-] https://bugzilla.mozilla.org/1107372
   // user_pref("browser.trackingprotection.gethashURL", ""); // browser.safebrowsing.provider.mozilla.gethashURL
   // user_pref("browser.trackingprotection.updateURL", ""); // browser.safebrowsing.provider.mozilla.updateURL
// 1803: remove plugin finder service
   // [1] http://kb.mozillazine.org/Pfs.datasource.url
   // [-] https://bugzilla.mozilla.org/1202193
user_pref("pfs.datasource.url", "");
// 5003: disable new search panel UI
   // [-] https://bugzilla.mozilla.org/1119250
   // user_pref("browser.search.showOneOffButtons", false);
// ***/
/* FF44
// 0414: disable safebrowsing's real-time binary checking (google) [FF43+]
   // [-] https://bugzilla.mozilla.org/1237103
user_pref("browser.safebrowsing.provider.google.appRepURL", ""); // browser.safebrowsing.appRepURL
// 1200's: block rc4 whitelist
   // [-] https://bugzilla.mozilla.org/1215796
user_pref("security.tls.insecure_fallback_hosts.use_static_list", false);
// 2300's: disable SharedWorkers
   // [1] https://trac.torproject.org/projects/tor/ticket/15562
   // [-] https://bugzilla.mozilla.org/1207635
user_pref("dom.workers.sharedWorkers.enabled", false);
// 2403: disable scripts changing images
   // [TEST] https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_img_src2
   // [-] https://bugzilla.mozilla.org/773429
   // user_pref("dom.disable_image_src_set", true);
// ***/
/* FF45
// 1021b: disable deferred level of storing extra session data 0=all 1=http-only 2=none
   // extra session data contains contents of forms, scrollbar positions, cookies and POST data
   // [-] https://bugzilla.mozilla.org/1235379
user_pref("browser.sessionstore.privacy_level_deferred", 2);
// ***/
/* FF46
// 0333: disable health report
   // [-] https://bugzilla.mozilla.org/1234526
user_pref("datareporting.healthreport.service.enabled", false); // [HIDDEN PREF]
user_pref("datareporting.healthreport.documentServerURI", ""); // [HIDDEN PREF]
// 0334b: disable FHR (Firefox Health Report) v2 data being sent to Mozilla servers
   // [-] https://bugzilla.mozilla.org/1234522
user_pref("datareporting.policy.dataSubmissionEnabled.v2", false);
// 0414: disable safebrowsing pref - replaced by browser.safebrowsing.downloads.remote.url
   // [-] https://bugzilla.mozilla.org/1239587
user_pref("browser.safebrowsing.appRepURL", ""); // Google application reputation check
// 0420: disable polaris (part of Tracking Protection, never used in stable)
   // [-] https://bugzilla.mozilla.org/1235565
   // user_pref("browser.polaris.enabled", false);
// 0510: disable "Pocket" [FF39+] - replaced by extensions.pocket.*
   // [-] https://bugzilla.mozilla.org/1215694
user_pref("browser.pocket.enabled", false);
user_pref("browser.pocket.api", "");
user_pref("browser.pocket.site", "");
user_pref("browser.pocket.oAuthConsumerKey", "");
// ***/
/* FF47
// 0330b: set unifiedIsOptIn to make sure telemetry respects OptIn choice and that telemetry
   // is enabled ONLY for people that opted into it, even if unified Telemetry is enabled
   // [-] https://bugzilla.mozilla.org/1236580
user_pref("toolkit.telemetry.unifiedIsOptIn", true); // [HIDDEN PREF]
// 0333b: disable about:healthreport page UNIFIED
   // [-] https://bugzilla.mozilla.org/1236580
user_pref("datareporting.healthreport.about.reportUrlUnified", "data:text/plain,");
// 0807: disable history manipulation
   // [1] https://developer.mozilla.org/docs/Web/API/History_API
   // [-] https://bugzilla.mozilla.org/1249542
user_pref("browser.history.allowPopState", false);
user_pref("browser.history.allowPushState", false);
user_pref("browser.history.allowReplaceState", false);
// ***/
/* FF48
// 0806: disable 'unified complete': 'Search with [default search engine]'
   // [-] http://techdows.com/2016/05/firefox-unified-complete-aboutconfig-preference-removed.html
   // [-] https://bugzilla.mozilla.org/1181078
user_pref("browser.urlbar.unifiedcomplete", false);
// ***/
/* FF49
// 0372: disable "Hello"
   // [1] https://www.mozilla.org/privacy/archive/hello/2016-03/
   // [2] https://security.stackexchange.com/questions/94284/how-secure-is-firefox-hello
   // [-] https://bugzilla.mozilla.org/1287827
user_pref("loop.enabled", false);
user_pref("loop.server", "");
user_pref("loop.feedback.formURL", "");
user_pref("loop.feedback.manualFormURL", "");
user_pref("loop.facebook.appId", "");
user_pref("loop.facebook.enabled", false);
user_pref("loop.facebook.fallbackUrl", "");
user_pref("loop.facebook.shareUrl", "");
user_pref("loop.logDomains", false);
// 2201: disable new window scrollbars being hidden
   // [-] https://bugzilla.mozilla.org/1257887
user_pref("dom.disable_window_open_feature.scrollbars", true);
// 2303: disable push notification (UDP wake-up)
   // [-] https://bugzilla.mozilla.org/1265914
user_pref("dom.push.udp.wakeupEnabled", false);
// ***/
/* FF50
// 0101: disable Windows10 intro on startup [WINDOWS]
   // [-] https://bugzilla.mozilla.org/1274633
user_pref("browser.usedOnWindows10.introURL", "");
// 0308: disable plugin update notifications
   // [-] https://bugzilla.mozilla.org/1277905
user_pref("plugins.update.notifyUser", false);
// 0410: disable "Block dangerous and deceptive content" - replaced by browser.safebrowsing.phishing.enabled
   // [-] https://bugzilla.mozilla.org/1025965
   // user_pref("browser.safebrowsing.enabled", false);
// 1266: disable rc4 ciphers
   // [1] https://trac.torproject.org/projects/tor/ticket/17369
   // [-] https://bugzilla.mozilla.org/1268728
   // [-] https://www.fxsitecompat.com/en-CA/docs/2016/rc4-support-has-been-completely-removed/
user_pref("security.ssl3.ecdhe_ecdsa_rc4_128_sha", false);
user_pref("security.ssl3.ecdhe_rsa_rc4_128_sha", false);
user_pref("security.ssl3.rsa_rc4_128_md5", false);
user_pref("security.ssl3.rsa_rc4_128_sha", false);
// 1809: remove Mozilla's plugin update URL
   // [-] https://bugzilla.mozilla.org/1277905
user_pref("plugins.update.url", "");
// ***/
/* FF51
// 0702: disable SPDY
   // [-] https://bugzilla.mozilla.org/1248197
user_pref("network.http.spdy.enabled.v3-1", false);
// 1851: delay play of videos until they're visible
   // [1] https://bugzilla.mozilla.org/1180563
   // [-] https://bugzilla.mozilla.org/1262053
user_pref("media.block-play-until-visible", true);
// 2504: disable virtual reality devices
   // [-] https://bugzilla.mozilla.org/1250244
user_pref("dom.vr.oculus050.enabled", false);
// ***/
/* FF52
// 1601: disable referer from an SSL Website
   // [-] https://bugzilla.mozilla.org/1308725
user_pref("network.http.sendSecureXSiteReferrer", false);
// 1850: disable Adobe EME "Primetime CDM" (Content Decryption Module)
   // [1] https://trac.torproject.org/projects/tor/ticket/16285
   // [-] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1329538,1337121 // FF52
   // [-] https://bugzilla.mozilla.org/1329543 // FF53
user_pref("media.gmp-eme-adobe.enabled", false);
user_pref("media.gmp-eme-adobe.visible", false);
user_pref("media.gmp-eme-adobe.autoupdate", false);
// 2405: disable WebTelephony API
   // [1] https://wiki.mozilla.org/WebAPI/Security/WebTelephony
   // [-] https://bugzilla.mozilla.org/1309719
user_pref("dom.telephony.enabled", false);
// ***/
/* FF53
// 1265: block rc4 fallback
   // [-] https://bugzilla.mozilla.org/1130670
user_pref("security.tls.unrestricted_rc4_fallback", false);
// 1806: disable Acrobat, Quicktime, WMP (the string = min version number allowed)
   // [-] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1317108,1317109,1317110
user_pref("plugin.scan.Acrobat", "99999");
user_pref("plugin.scan.Quicktime", "99999");
user_pref("plugin.scan.WindowsMediaPlayer", "99999");
// 2022: disable screensharing
   // [-] https://bugzilla.mozilla.org/1329562
user_pref("media.getusermedia.screensharing.allow_on_old_platforms", false);
// 2507: disable keyboard fingerprinting
   // [-] https://bugzilla.mozilla.org/1322736
user_pref("dom.beforeAfterKeyboardEvent.enabled", false);
// ***/
/* FF54
// 0415: disable reporting URLs (safe browsing)
   // [-] https://bugzilla.mozilla.org/1288633
user_pref("browser.safebrowsing.reportMalwareMistakeURL", "");
user_pref("browser.safebrowsing.reportPhishMistakeURL", "");
// 1830: block websites detecting DRM is disabled
   // [-] https://bugzilla.mozilla.org/1242321
user_pref("media.eme.apiVisible", false);
// 2425: disable Archive Reader API
   // i.e. reading archive contents directly in the browser, through DOM file objects
   // [-] https://bugzilla.mozilla.org/1342361
user_pref("dom.archivereader.enabled", false);
// ***/
/* FF55
// 0209: disable geolocation on non-secure origins [FF54+]
   // [1] https://bugzilla.mozilla.org/1269531
   // [-] https://bugzilla.mozilla.org/1072859
user_pref("geo.security.allowinsecure", false);
// 0336: disable "Heartbeat" (Mozilla user rating telemetry) [FF37+]
   // [1] https://trac.torproject.org/projects/tor/ticket/18738
   // [-] https://bugzilla.mozilla.org/1361578
user_pref("browser.selfsupport.enabled", false); // [HIDDEN PREF]
user_pref("browser.selfsupport.url", "");
// 0360: disable new tab "pings"
   // [-] https://bugzilla.mozilla.org/1241390
user_pref("browser.newtabpage.directory.ping", "data:text/plain,");
// 0861: disable saving form history on secure websites
   // [-] https://bugzilla.mozilla.org/1361220
user_pref("browser.formfill.saveHttpsForms", false);
// 0863: disable Form Autofill [FF54+] - replaced by extensions.formautofill.*
   // [-] https://bugzilla.mozilla.org/1364334
user_pref("browser.formautofill.enabled", false);
// 2410: disable User Timing API
   // [1] https://trac.torproject.org/projects/tor/ticket/16336
   // [-] https://bugzilla.mozilla.org/1344669
user_pref("dom.enable_user_timing", false);
// 2507: disable keyboard fingerprinting (physical keyboards) [FF38+]
   // The Keyboard API allows tracking the "read parameter" of pressed keys in forms on
   // web pages. These parameters vary between types of keyboard layouts such as QWERTY,
   // AZERTY, Dvorak, and between various languages, e.g. German vs English.
   // [WARNING] Don't use if Android + physical keyboard
   // [1] https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code
   // [2] https://www.privacy-handbuch.de/handbuch_21v.htm
   // [-] https://bugzilla.mozilla.org/1352949
user_pref("dom.keyboardevent.code.enabled", false);
// 5015: disable tab animation - replaced by toolkit.cosmeticAnimations.enabled
   // [-] https://bugzilla.mozilla.org/1352069
user_pref("browser.tabs.animate", false);
// 5016: disable fullscreeen animation - replaced by toolkit.cosmeticAnimations.enabled
   // [-] https://bugzilla.mozilla.org/1352069
user_pref("browser.fullscreen.animate", false);
// ***/
/* FF56
// 0515: disable Screenshots (rollout pref only) [FF54+]
   // [-] https://bugzilla.mozilla.org/1386333
   // user_pref("extensions.screenshots.system-disabled", true);
// 0517: disable Form Autofill [FF55+] - replaced by extensions.formautofill.available
   // [-] https://bugzilla.mozilla.org/1385201
user_pref("extensions.formautofill.experimental", false);
// ***/
/* FF57
// 0374: disable "social" integration
   // [1] https://developer.mozilla.org/docs/Mozilla/Projects/Social_API
   // [-] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1388902,1406193 (some leftovers were removed in FF58)
user_pref("social.whitelist", "");
user_pref("social.toast-notifications.enabled", false);
user_pref("social.shareDirectory", "");
user_pref("social.remote-install.enabled", false);
user_pref("social.directories", "");
user_pref("social.share.activationPanelEnabled", false);
user_pref("social.enabled", false); // [HIDDEN PREF]
// 1830: disable DRM's EME WideVineAdapter [FF55+]
   // [-] https://bugzilla.mozilla.org/1395468
user_pref("media.eme.chromium-api.enabled", false);
// 2608: disable WebIDE extension downloads (Valence)
   // [1] https://trac.torproject.org/projects/tor/ticket/16222
   // [-] https://bugzilla.mozilla.org/1393497
user_pref("devtools.webide.autoinstallFxdtAdapters", false);
// 2600's: disable SimpleServiceDiscovery - which can bypass proxy settings - e.g. Roku
   // [1] https://trac.torproject.org/projects/tor/ticket/16222
   // [-] https://bugzilla.mozilla.org/1393582
user_pref("browser.casting.enabled", false);
// 5022: hide recently bookmarked items (you still have the original bookmarks) [FF49+]
   // [-] https://bugzilla.mozilla.org/1401238
user_pref("browser.bookmarks.showRecentlyBookmarked", false);
// ***/
/* FF58
// 0351: disable sending of crash reports [FF51+] - replaced by *.autoSubmit2
   // [-] https://bugzilla.mozilla.org/1424373
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit", false);
// ***/
/* FF59
// 0203: disable using OS locale, force APP locale - replaced by intl.locale.requested
   // [-] https://bugzilla.mozilla.org/1414390
user_pref("intl.locale.matchOS", false);
// 0204: set APP locale - replaced by intl.locale.requested
   // [-] https://bugzilla.mozilla.org/1414390
user_pref("general.useragent.locale", "en-US");
// 0333b: disable about:healthreport page (which connects to Mozilla for locale/css+js+json)
   // If you have disabled health reports, then this about page is useless - disable it
   // If you want to see what health data is present, then this must be set at default
   // [-] https://bugzilla.mozilla.org/1352497
user_pref("datareporting.healthreport.about.reportUrl", "data:text/plain,");
// 0511: disable FlyWeb [FF49+]
   // Flyweb is a set of APIs for advertising and discovering local-area web servers
   // [1] https://flyweb.github.io/
   // [2] https://wiki.mozilla.org/FlyWeb/Security_scenarios
   // [3] https://www.ghacks.net/2016/07/26/firefox-flyweb/
   // [-] https://bugzilla.mozilla.org/1374574
user_pref("dom.flyweb.enabled", false);
// 1007: disable randomized FF HTTP cache decay experiments
   // [1] https://trac.torproject.org/projects/tor/ticket/13575
   // [-] https://bugzilla.mozilla.org/1430197
user_pref("browser.cache.frecency_experiment", -1);
// 1242: enable Mixed-Content-Blocker to use the HSTS cache but disable the HSTS Priming requests [FF51+]
   // Allow resources from domains with an existing HSTS cache record or in the HSTS preload list
   // to be upgraded to HTTPS internally but disable sending out HSTS Priming requests, because
   // those may cause noticeable delays e.g. requests time out or are not handled well by servers
   // [NOTE] If you want to use the priming requests make sure 'use_hsts' is also true
   // [1] https://bugzilla.mozilla.org/1246540#c145
   // [-] https://bugzilla.mozilla.org/1424917
user_pref("security.mixed_content.use_hsts", true);
user_pref("security.mixed_content.send_hsts_priming", false);
// 1606: set the default Referrer Policy [FF53+] - replaced by network.http.referer.defaultPolicy
   // [-] https://bugzilla.mozilla.org/587523
user_pref("network.http.referer.userControlPolicy", 3);
// 1804: disable plugins using external/untrusted scripts with XPCOM or XPConnect
   // [-] (part8) https://bugzilla.mozilla.org/1416703#c21
user_pref("security.xpconnect.plugin.unrestricted", false);
// 2022: disable screensharing domain whitelist
   // [-] https://bugzilla.mozilla.org/1411742
user_pref("media.getusermedia.screensharing.allowed_domains", "");
// 2023: disable camera stuff
   // [-] (part7) https://bugzilla.mozilla.org/1416703#c21
user_pref("camera.control.face_detection.enabled", false);
// 2202: prevent scripts from changing the status text
   // [-] https://bugzilla.mozilla.org/1425999
user_pref("dom.disable_window_status_change", true);
// 2416: disable idle observation
   // [-] (part7) https://bugzilla.mozilla.org/1416703#c21
user_pref("dom.idle-observers-api.enabled", false);
// ***/
/* FF60
// 0360: disable new tab tile ads & preload & marketing junk
   // [-] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1370930,1433133
user_pref("browser.newtabpage.directory.source", "data:text/plain,");
user_pref("browser.newtabpage.enhanced", false);
user_pref("browser.newtabpage.introShown", true);
// 0512: disable Shield - replaced internally by Normandy (see 0503) [FF53+]
   // Shield is an telemetry system (including Heartbeat) that can also push and test "recipes"
   // [1] https://wiki.mozilla.org/Firefox/Shield
   // [2] https://github.com/mozilla/normandy
   // [-] https://bugzilla.mozilla.org/1436113
user_pref("extensions.shield-recipe-client.enabled", false);
user_pref("extensions.shield-recipe-client.api_url", "");
// 0514: disable Activity Stream [FF54+]
   // [-] https://bugzilla.mozilla.org/1433324
user_pref("browser.newtabpage.activity-stream.enabled", false);
// 2301: disable workers
   // [SETUP-WEB] Disabling workers *will* break sites (e.g. Google Street View, Twitter)
   // [NOTE] CVE-2016-5259, CVE-2016-2812, CVE-2016-1949, CVE-2016-5287 (fixed)
   // [-] https://bugzilla.mozilla.org/1434934
user_pref("dom.workers.enabled", false);
// 5000's: open "page/selection source" in a new window
   // [-] https://bugzilla.mozilla.org/1418403
   // user_pref("view_source.tab", false);
// ***/

/* ESR60.x still uses all the following prefs
// [NOTE] replace the * with a slash in the line above to re-enable them
// FF61
// 0501: disable experiments
   // [1] https://wiki.mozilla.org/Telemetry/Experiments
   // [-] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1420908,1450801
user_pref("experiments.enabled", false);
user_pref("experiments.manifest.uri", "");
user_pref("experiments.supported", false);
user_pref("experiments.activeExperiment", false);
// 2612: disable remote JAR files being opened, regardless of content type [FF42+]
   // [1] https://bugzilla.mozilla.org/1173171
   // [2] https://www.fxsitecompat.com/en-CA/docs/2015/jar-protocol-support-has-been-disabled-by-default/
   // [-] https://bugzilla.mozilla.org/1427726
user_pref("network.jar.block-remote-files", true);
// 2613: disable JAR from opening Unsafe File Types
   // [-] https://bugzilla.mozilla.org/1427726
user_pref("network.jar.open-unsafe-types", false);
// * * * /
// FF62
// 1803: disable Java plugin
   // [-] (part5) https://bugzilla.mozilla.org/1461243
user_pref("plugin.state.java", 0);
// * * * /
// FF63
// 0202: disable GeoIP-based search results
   // [NOTE] May not be hidden if Firefox has changed your settings due to your locale
   // [-] https://bugzilla.mozilla.org/1462015
user_pref("browser.search.countryCode", "US"); // [HIDDEN PREF]
// 0301a: disable auto-update checks for Firefox
   // [SETTING] General>Firefox Updates>Never check for updates
   // [-] https://bugzilla.mozilla.org/1420514
   // user_pref("app.update.enabled", false);
// 0402: enable Kinto blocklist updates [FF50+]
   // What is Kinto?: https://wiki.mozilla.org/Firefox/Kinto#Specifications
   // As Firefox transitions to Kinto, the blocklists have been broken down into entries for certs to be
   // revoked, extensions and plugins to be disabled, and gfx environments that cause problems or crashes
   // [-] https://bugzilla.mozilla.org/1458917
user_pref("services.blocklist.update_enabled", true);
// 0503: disable "Savant" Shield study [FF61+]
   // [-] https://bugzilla.mozilla.org/1457226
user_pref("shield.savant.enabled", false);
// 1031: disable favicons in tabs and new bookmarks - merged into browser.chrome.site_icons
   // [-] https://bugzilla.mozilla.org/1453751
   // user_pref("browser.chrome.favicons", false);
// 2030: disable auto-play of HTML5 media - replaced by media.autoplay.default
   // [SETUP-WEB] This may break video playback on various sites
   // [-] https://bugzilla.mozilla.org/1470082
user_pref("media.autoplay.enabled", false);
// 2704: set cookie lifetime in days (see 2703)
   // [-] https://bugzilla.mozilla.org/1457170
   // user_pref("network.cookie.lifetime.days", 90); // [DEFAULT: 90]
// 5000's: enable "Ctrl+Tab cycles through tabs in recently used order" - replaced by browser.ctrlTab.recentlyUsedOrder
   // [-] https://bugzilla.mozilla.org/1473595
   // user_pref("browser.ctrlTab.previews", true);
// * * * /
// ***/

/* END: internal custom pref to test for syntax errors ***/
user_pref("_user.js.parrot", "SUCCESS: No no he's not dead, he's, he's restin'!");
