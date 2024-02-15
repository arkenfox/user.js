## 📃 My changes
Until I get the time to write every change I make down, you should just look at the [commit history from me](https://github.com/Wraaath/user.js/commits/master/?author=Wraaath).

## ⬇️ Installation/Usage
1. [Install Firefox](https://github.com/Wraaath/user.js#-downloading-firefox-the-right-way)
2. Click the green `<> Code`-button and clone the repo or download as ZIP
3. Find your Firefox profile directory: \
In Firefox: `about:support` -> `Profile Folder` -> `Open Folder` and close Firefox
4. Make your changes to the `user-overrides.js`-file
5. Copy `user-overrides.js`, `user.js` files to your profile folder
6. Copy over the "updater" and "prefsCleaner": \
Windows: Copy `updater.bat`, `prefsCleaner.bat` to your profile folder \
Linux: Copy `updater.sh`, `prefsCleaner.sh` to your profile folder
7. Run the "updater" and "prefsCleaner". 

## 🦊 Downloading Firefox (the right way)
The Firefox installer from [Mozilla's official webpage](https://www.mozilla.org/en-US/firefox/new/) contains a unique download token.[^1] You should therefore get the installer from your package-manager, or their FTP repository:
* [Official Mozilla FTP repository](https://ftp.mozilla.org/pub/firefox/releases/)

[^1]: [PrivacyGuides.org](https://www.privacyguides.org/en/desktop-browsers/?h=firefox#firefox)

## 📖 Troubleshooting
### Twitch (or other websites) "Your browser is not currently supported. Please use a recommended browser or learn more here."
You will likely not be able to log in to Twitch using this config since it uses [RFP (Resist Fingerprinting)](https://github.com/arkenfox/user.js/wiki/3.3-Overrides-%5BTo-RFP-or-Not%5D#-fingerprinting). Use one of the following options:

#### Option 1 (Recommended, although a little annoying):
[u/gdmr458's Guide](https://www.reddit.com/r/LibreWolf/comments/17c8owv/comment/k5w373h/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

#### Option 2 (Works great, but requires a seperate window for Twitch):
Go to `about:profiles` \
Click `Create a New Profile` \
Click `Launch profile in new browser`

A new Firefox window should appear with a default Firefox. Use this only for websites you need, and you should be good to go. No need to configure it.

---

### 🟪  user.js
A `user.js` is a configuration file that can control Firefox settings - for a more technical breakdown and explanation, you can read more in the [wiki](https://github.com/arkenfox/user.js/wiki/2.1-User.js)

### 🟩  the arkenfox user.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The `arkenfox user.js` is a **template** which aims to provide as much privacy and enhanced security as possible, and to reduce tracking and fingerprinting as much as possible - while minimizing any loss of functionality and breakage (but it will happen).

Everyone, experts included, should at least read the [wiki](https://github.com/arkenfox/user.js/wiki), as it contains important information regarding a few `user.js` settings. There is also an [interactive current release](https://arkenfox.github.io/gui/), thanks to [icpantsparti2](https://github.com/icpantsparti2).

Note that we do *not* recommend connecting over Tor on Firefox. Use the [Tor Browser](https://www.torproject.org/projects/torbrowser.html.en) if your [threat model](https://2019.www.torproject.org/about/torusers.html) calls for it, or for accessing hidden services.

Also be aware that the `arkenfox user.js` is made specifically for desktop Firefox. Using it as-is in other Gecko-based browsers can be counterproductive, especially in the Tor Browser.

### 🟧  sitemap

 - [releases](https://github.com/arkenfox/user.js/releases)
 - [changelogs](https://github.com/arkenfox/user.js/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Achangelog)
 - [wiki](https://github.com/arkenfox/user.js/wiki)
 - [stickies](https://github.com/arkenfox/user.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22sticky+topic%22)
 - [diffs](https://github.com/arkenfox/user.js/issues?q=is%3Aissue+label%3Adiffs)
 - [common questions and answers](https://github.com/arkenfox/user.js/issues?q=is%3Aissue+label%3Aanswered)

### 🟥  acknowledgments
Literally thousands of sources, references and suggestions. Many thanks, and much appreciated.
