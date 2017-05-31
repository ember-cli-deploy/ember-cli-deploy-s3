# Change Log

## [v1.1.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v1.1.0) (2017-05-31)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v1.0.0...v1.1.0)

**Merged pull requests:**
- Fix defaultMimeType option binding [\#94](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/94) ([wytlytningNZ](https://github.com/wytlytningNZ))

## [v1.0.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v1.0.0) (2017-03-25)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v1.0.0-beta.0...v1.0.0)

No changes from 1.0.0-beta.0

## [v1.0.0-beta.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v1.0.0-beta.0) (2017-03-25)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.4.0...v1.0.0-beta.0)

**Merged pull requests:**

- Update ember-cli and dependencies [\#89](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/89) ([lukemelia](https://github.com/lukemelia))
- Replace `ember-cli/ext/promise` with `rsvp` [\#88](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/88) ([backspace](https://github.com/backspace))
- Instructions to set up public access to S3 [\#86](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/86) ([RobinDaugherty](https://github.com/RobinDaugherty))
- \[DOC\] update links to other plugins in REAMD [\#85](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/85) ([lukemelia](https://github.com/lukemelia))
- Dependency Upgrades [\#84](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/84) ([kturney](https://github.com/kturney))
- Add confi option for signatureVersion [\#83](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/83) ([pedrokost](https://github.com/pedrokost))
- Update ember cli 2.10 [\#80](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/80) ([jrjohnson](https://github.com/jrjohnson))
- Adds support for batching requests to S3 [\#79](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/79) ([tomlagier](https://github.com/tomlagier))
- \[DOC\] Fix broken link to 'Plugin Documentation' [\#77](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/77) ([mattmazzola](https://github.com/mattmazzola))
- Update minimatch to ^3.0.3 [\#76](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/76) ([jpadilla](https://github.com/jpadilla))
- \[Bugfix\] Remove the Principal Policy [\#65](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/65) ([Jaspaul](https://github.com/Jaspaul))

## [v0.4.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.4.0) (2016-11-02)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.3.2...v0.4.0)

**Merged pull requests:**

- Loosen aws-sdk version [\#74](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/74) ([ryansch](https://github.com/ryansch))
- Add Server Side Encryption [\#72](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/72) ([sethpollack](https://github.com/sethpollack))
- Allow support for alternate AWS profiles. [\#71](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/71) ([seanstar12](https://github.com/seanstar12))
- filesUploaded should return all files when using manifest [\#67](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/67) ([wongpeiyi](https://github.com/wongpeiyi))

## [v0.3.2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.3.2) (2016-09-13)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.3.1...v0.3.2)

**Merged pull requests:**

- added config to include hidden folders in the S3 upload [\#70](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/70) ([habdelra](https://github.com/habdelra))
- \[DOC\] Add tip for slashes in the prefix [\#69](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/69) ([harianus](https://github.com/harianus))
- Allow setting of default mime type for files with no extension [\#63](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/63) ([robwebdev](https://github.com/robwebdev))
- Add otf file type to default filePattern [\#62](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/62) ([koriroys](https://github.com/koriroys))
- Add network proxy option [\#61](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/61) ([v-shan](https://github.com/v-shan))

## [v0.3.1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.3.1) (2016-06-16)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.3.0...v0.3.1)

**Merged pull requests:**

- fix \#59 [\#60](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/60) ([ghedamat](https://github.com/ghedamat))
- Update minimum S3 permissions [\#58](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/58) ([jeffreybiles](https://github.com/jeffreybiles))
- Includes session token if provided to client initialization. [\#57](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/57) ([RickCSong](https://github.com/RickCSong))
- Fix issue \#54: manifest.txt should be uploaded as last [\#55](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/55) ([YoranBrondsema](https://github.com/YoranBrondsema))

## [v0.3.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.3.0) (2016-04-19)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.2.2...v0.3.0)

**Merged pull requests:**

- Configure Cache-Control and Expires headers on the uploaded files. [\#53](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/53) ([YoranBrondsema](https://github.com/YoranBrondsema))

## [v0.2.2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.2.2) (2016-04-01)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.2.1...v0.2.2)

**Merged pull requests:**

- Set the correct content type for gzipped files with the .gz ext [\#51](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/51) ([dannyfallon](https://github.com/dannyfallon))

## [v0.2.1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.2.1) (2016-02-06)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.2.0...v0.2.1)

**Merged pull requests:**

- update ember-cli-deploy-plugin [\#45](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/45) ([ghedamat](https://github.com/ghedamat))
- Fix AWS Credential Resolution link in README [\#43](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/43) ([reidab](https://github.com/reidab))

## [v0.2.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.2.0) (2015-12-15)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.1.0...v0.2.0)

**Merged pull requests:**

- \[DOC\] add CORS example, fixes \#22 [\#42](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/42) ([ghedamat](https://github.com/ghedamat))
- \[DOC\] Updated README.md to include S3 perimssions [\#40](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/40) ([MojoJojo](https://github.com/MojoJojo))
- Remove required keys, to support IAM roles [\#39](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/39) ([kkumler](https://github.com/kkumler))
- Warn about configuration sharing [\#31](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/31) ([LevelbossMike](https://github.com/LevelbossMike))
- Fix distFiles default in README [\#28](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/28) ([kpfefferle](https://github.com/kpfefferle))
- Fix README file typo [\#27](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/27) ([Saicheg](https://github.com/Saicheg))
- Fix typo in tests [\#26](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/26) ([kimroen](https://github.com/kimroen))
- add version badge [\#25](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/25) ([ghedamat](https://github.com/ghedamat))
- Make region a required property [\#24](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/24) ([achambers](https://github.com/achambers))
- doen't use path.join for urls [\#21](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/21) ([flecno](https://github.com/flecno))
- Add support for ACL on objects [\#20](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/20) ([flecno](https://github.com/flecno))

## [v0.1.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.1.0) (2015-10-25)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.1.0-beta.2...v0.1.0)

**Merged pull requests:**

- Update to use new verbose option for logging [\#19](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/19) ([lukemelia](https://github.com/lukemelia))
- add ico to default filePattern [\#16](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/16) ([jasonkriss](https://github.com/jasonkriss))
- add swf to default filePattern [\#15](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/15) ([jasonkriss](https://github.com/jasonkriss))

## [v0.1.0-beta.2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.1.0-beta.2) (2015-09-14)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.1.0-beta.1...v0.1.0-beta.2)

**Merged pull requests:**

- Update repo url [\#14](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/14) ([achambers](https://github.com/achambers))
- Update repository [\#13](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/13) ([achambers](https://github.com/achambers))
- Add content encoding to ContentType for text files [\#11](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/11) ([achambers](https://github.com/achambers))

## [v0.1.0-beta.1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.1.0-beta.1) (2015-08-08)
**Merged pull requests:**

- Updated README for 0.5.0 [\#10](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/10) ([achambers](https://github.com/achambers))
- Restructure to make more things pull from config, and use ember-cli-deploy-plugin base class [\#7](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/7) ([lukemelia](https://github.com/lukemelia))
- Manifest support [\#6](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/6) ([lukemelia](https://github.com/lukemelia))
- Log with a nice checkmark and the target S3 key [\#5](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/5) ([lukemelia](https://github.com/lukemelia))
- Include svg and webfonts in default filepattern [\#4](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/4) ([lukemelia](https://github.com/lukemelia))
- Support for working with a gzip plugin. [\#3](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/3) ([lukemelia](https://github.com/lukemelia))
- Indicate to ember-cli that this addon should be "before" redis [\#2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/2) ([lukemelia](https://github.com/lukemelia))
- Upload to s3 [\#1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/1) ([achambers](https://github.com/achambers))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
