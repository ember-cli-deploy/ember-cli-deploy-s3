# ember-cli-deploy-s3

> An ember-cli-deploy plugin to upload files to S3

[![](https://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/plugins/ember-cli-deploy-s3.svg)](http://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/)

This plugin uploads one or more files to an Amazon S3 bucket. It could be used to upload the assets (js, css, images etc) or indeed the application's index.html.

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][1].


## Quick Start

To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][2] is installed and configured.

- Install this plugin

```bash
$ ember install ember-cli-deploy-s3
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV.s3 = {
  accessKeyId: '<your-aws-access-key>',
  secretAccessKey: '<your-aws-secret>',
  bucket: '<your-s3-bucket>',
  region: '<the-region-your-bucket-is-in>'
}
```
- Run the pipeline

```bash
$ ember deploy
```

## Installation
Run the following command in your terminal:

```bash
ember install ember-cli-deploy-s3
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

- `configure`
- `upload`

## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][1].

### accessKeyId (`required`)

The AWS access key for the user that has the ability to upload to the `bucket`.

*Default:* `undefined`

### secretAccessKey (`required`)

The AWS secret for the user that has the ability to upload to the `bucket`.

*Default:* `undefined`

### bucket (`required`)

The AWS bucket that the files will be uploaded to.

*Default:* `undefined`

### region (`required`)

The region the AWS `bucket` is located in.

*Default:* `undefined`

### acl

The ACL to apply to the objects.

*Default:* `public-read`

### prefix

A directory within the `bucket` that the files should be uploaded in to.

*Default:* `''`

### filePattern

Files that match this pattern will be uploaded to S3. The file pattern must be relative to `distDir`.

*Default:* '\*\*/\*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2}'

### distDir

The root directory where the files matching `filePattern` will be searched for. By default, this option will use the `distDir` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distDir`

### distFiles

The list of built project files. This option should be relative to `distDir` and should include the files that match `filePattern`. By default, this option will use the `distFiles` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distFiles`

### gzippedFiles

The list of files that have been gziped. This option should be relative to `distDir`. By default, this option will use the `gzippedFiles` property of the deployment context, provided by [ember-cli-deploy-gzip][3].

This option will be used to determine which files in `distDir`, that match `filePattern`, require the gzip content encoding when uploading.

*Default:* `context.gzippedFiles`

### manifestPath

The path to a manifest that specifies the list of files that are to be uploaded to S3.

This manifest file will be used to work out which files don't exist on S3 and, therefore, which files should be uploaded. By default, this option will use the `manifestPath` property of the deployment context, provided by [ember-cli-deploy-manifest][4].

*Default:* `context.manifestPath`

### uploadClient

The client used to upload files to S3. This allows the user the ability to use their own client for uploading instead of the one provided by this plugin.

The client specified MUST implement a function called `upload`.

*Default:* the upload client provided by ember-cli-deploy-s3

### s3Client

The underlying S3 library used to upload the files to S3. This allows the user to use the default upload client provided by this plugin but switch out the underlying library that is used to actually send the files.

The client specified MUST implement functions called `getObject` and `putObject`.

*Default:* the default S3 library is `aws-sdk`
## Minimum S3 Permissions

Ensure you have the minimum required permissions configured for the user (accessKeyId). A bare minimum policy should have the following permissions:

```
{
    "Statement": [
        {
            "Sid": "Stmt1EmberCLIS3DeployPolicy",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:PutObjectACL"
            ],
            "Resource": [
                "arn:aws:s3:::<your-s3-bucket-name>/*"
            ]
        }
    ]
}

```
Replace <your-s3-bucket-name> with the name of the actual bucket you are deploying to. Also, remember that "PutObject" permission will effectively overwrite any existing files with the same name unless you use a fingerprinting or a manifest plugin.

## Prerequisites

The following properties are expected to be present on the deployment `context` object:

- `distDir`      (provided by [ember-cli-deploy-build][2])
- `distFiles`    (provided by [ember-cli-deploy-build][2])
- `gzippedFiles` (provided by [ember-cli-deploy-gzip][3])
- `manifestPath` (provided by [ember-cli-deploy-manifest][4])

## Running Tests

- `npm test`

[1]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/lukemelia/ember-cli-deploy-gzip "ember-cli-deploy-gzip"
[4]: https://github.com/lukemelia/ember-cli-deploy-manifest "ember-cli-deploy-manifest"
