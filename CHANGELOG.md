# Change Log

## [0.4.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/0.4.0) (2016-11-01)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.3.2...0.4.0)

- [#67](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/67) filesUploaded should return all files when using manifest [@wongpeiyi/fix](https://github.com/wongpeiyi/fix)
- [#71](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/71) Allow support for alternate AWS profiles. [@seanstar12](https://github.com/seanstar12)
- [#72](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/72) Add Server Side Encryption [@sethpollack](https://github.com/sethpollack)
- [#74](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/74) Loosen aws-sdk version [@outstand](https://github.com/outstand)

## [0.3.2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/0.3.2) (2016-09-13)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.3.1...0.3.2)

- added config to include hidden folders in the S3 upload [\#70](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/70) ([habdelra](https://github.com/habdelra))
- \[DOC\] Add tip for slashes in the prefix [\#69](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/69) ([harianus](https://github.com/harianus))
- Allow setting of default mime type for files with no extension [\#63](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/63) ([robwebdev](https://github.com/robwebdev))
- Add otf file type to default filePattern [\#62](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/62) ([koriroys](https://github.com/koriroys))
- Add network proxy option [\#61](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/61) ([v-shan](https://github.com/v-shan))

## [v0.3.1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/v0.3.1) (2016-06-16)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.3.0...v0.3.1)
- Version 2.4.0 of aws-s3 client causing issues - SignatureDoesNotMatch [\#59](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/issues/59)
- fix \#59 [\#60](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/60) ([ghedamat](https://github.com/ghedamat))
- Includes session token if provided to client initialization. [\#57](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/57) ([RickCSong](https://github.com/RickCSong))
- manifest.txt should be uploaded last [\#55](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/55) ([YoranBrondsema](https://github.com/YoranBrondsema))

## [0.3.0](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/0.3.0) (2016-04-19)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.2.2...0.3.0)

- Configure Cache-Control and Expires headers on the uploaded files. [\#53](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/53) ([YoranBrondsema](https://github.com/YoranBrondsema))

## [0.2.2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/0.2.2) (2016-04-01)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.2.1...0.2.2)

- Set the correct content type for gzipped files with the .gz ext [\#51](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/51) ([dannyfallon](https://github.com/dannyfallon))

## [0.2.1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/tree/0.2.1) (2016-02-06)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/compare/v0.2.0...0.2.1)

#### Community Contributions

- update ember-cli-deploy-plugin [\#45](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/45) ([ghedamat](https://github.com/ghedamat))
- Fix AWS Credential Resolution link in README [\#43](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/43) ([reidab](https://github.com/reidab))

### v0.2.0

#### Community Contributions

- [#20](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/20) Add support for ACL on objects [@flecno](https://github.com/flecno)
- [#24](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/24) Make region a required property [@achambers](https://github.com/achambers)
- [#21](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/21) don't use path.join for urls [@flecno](https://github.com/flecno)
- [#31](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/31) Warn about configuration sharing [@ember-cli-deploy](https://github.com/ember-cli-deploy)
- [#39](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/39) Remove required keys, to support IAM roles [@kkumler/feature](https://github.com/kkumler/feature)

### v0.1.0

#### Community Contributions

- [#11](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/11) Add content encoding to ContentType for text files [@achambers](https://github.com/achambers)

Thank you to all who took the time to contribute!

#### Community Contributions

- [#1](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/1) Upload to s3 [@achambers](https://github.com/achambers)
- [#2](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/2) Indicate to ember-cli that this addon should be "before" redis [@lukemelia](https://github.com/lukemelia)
- [#3](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/3) Support for working with a gzip plugin. [@lukemelia](https://github.com/lukemelia)
- [#4](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/4) Include svg and webfonts in default filepattern [@lukemelia](https://github.com/lukemelia)
- [#5](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/5) Log with a nice checkmark and the target S3 key [@lukemelia](https://github.com/lukemelia)
- [#6](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/6) Manifest support [@lukemelia](https://github.com/lukemelia)
- [#7](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/7) Restructure to make more things pull from config, and use ember-cli-deploy-plugin base class [@lukemelia](https://github.com/lukemelia)
- [#10](https://github.com/ember-cli-deploy/ember-cli-deploy-s3/pull/10) Updated README for 0.5.0 [@achambers](https://github.com/achambers)

Thank you to all who took the time to contribute!
