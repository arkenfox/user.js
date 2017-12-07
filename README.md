### ![](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/wikipiki/bullet01.png) user.js
A `user.js` is a configuration file that can control hundreds of Firefox settings. For a more technical breakdown and explanation, you can read more on the [overview](https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.1-Overview) wiki page.

### ![](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/wikipiki/bullet01.png) ghacks user.js
The [ghacks user.js](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/user.js) is a template, which, as provided, aims (![](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/wikipiki/exclamation.png) with [extensions](https://github.com/ghacksuserjs/ghacks-user.js/wiki/Appendix-B:-Extensions) <sup>1</sup> ) to provide as much privacy and enhanced security as possible, and to reduce tracking and fingerprinting as much as possible - while minimizing any loss of functionality and breakage (but it will happen).

No one size fits all and not all sites have the same requirements, so consider using [multiple profiles](https://github.com/ghacksuserjs/ghacks-user.js/wiki/2.3-Concurrent-Profiles) with customized changes.

### ![](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/wikipiki/bullet01.png) usage
Everyone, experts included, should at least read the [implementation](https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.3-Implementation) wiki page, as it contains important information regarding a few default settings we use. The rest of the [wiki](https://github.com/ghacksuserjs/ghacks-user.js/wiki) is helpful as well.

### ![](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/wikipiki/bullet01.png) acknowledgments
Literally thousands of sources, references and suggestions. That said...

* Martin Brinkmann at [ghacks](https://www.ghacks.net/) <sup>2</sup>
   * 100% genuine super-nice all-around good guy
* The ghacks community and commentators
   * Special mentions to [earthlng](https://github.com/earthlng), Tom Hawack, Just me, Conker, Rockin’ Jerry, Ainatar, Parker Lewis
* [12bytes](http://12bytes.org/tech/firefoxgecko-configuration-guide-for-privacy-and-performance-buffs)
   * The 12bytes article now uses this user.js and supplements it with an additonal JS hosted right [here](https://github.com/atomGit/Firefox-user.js) at github

<sup>1</sup> ![](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/wikipiki/exclamation.png) We highly recommend using uBlock Origin and uMatrix, and maybe a cookie extension (note: cookie & persistent storage extensions fail with First Party Isolation which we use <sup>[bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1381197)</sup>). Section 0400, if modified, allows Tracking Protection and Safe Browsing to be disabled. Do this at your own risk. See the [implementation](https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.3-Implementation) wiki page for more.

<sup>2</sup> The ghacks user.js was an independent project by [Thorin-Oakenpants](https://github.com/Thorin-Oakenpants) started in early 2015 and was [first published](https://www.ghacks.net/2015/08/18/a-comprehensive-list-of-firefox-privacy-and-security-settings/) at ghacks in August 2015. It was kept up-to-date and expanded by the original author with three major updates and articles. With Martin Brinkmann's blessing, it will keep the ghacks name.
