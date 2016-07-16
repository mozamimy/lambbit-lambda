# Lambbit-lambda

An AWS Lambda script for [Lambbit-client](https://github.com/mozamimy/lambbit-client).

# Requirements

- Node.js
- AWS account

# Setup

## AWS

First, create a bucket for Lammbit-lambda.
Also this script uses SES so you should verify your E-mail address or domain in the console of SES.

Next, create a policy for this script like below example,

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:ap-northeast-1:205176994941:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "ses:SendEmail",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:logs:ap-northeast-1:88888888888888888:log-group:/aws/lambda/Lambbit:*",
                "arn:aws:ses:us-east-1:8888888888888888:identity/*",
                "arn:aws:s3:::*"
            ]
        }
    ]
}
```

And attach the policy to a role for this script.

Next, create a Lambda function `Lambbit` and configure like below example,

- Runtime: Node.js 4.3
- Handler: Lammbit.handler
- Role: select a role created just now

And also you shoud set a trigger like below example,

- Bucket: select a bucket created just now
- Event type: Put
- Prefix: [empty]
- Suffix: [empty]

## Build

Execute below commands,

```
$ npm run compile
$ npm run build
```

You get a zip file (Lammbit.zip) and upload the zip file to AWS as a function package.
Finally, you can use [lammbit-client](https://github.com/mozamimy/lambbit-client)

# Lisence

MIT
