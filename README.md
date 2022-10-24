# toy-mailer

Toy e2e mailing service for a blog post. This is a very rough approximation of how I would "do" emails if someone asked me to get them working fairly reliably, quickly.

## Stack

### [temporalio](https://temporal.io/):

temporal is great for "long running" workflows. Often, our most critical pieces of business logic are complex, asyncronous, stateful workflows. Temporal abstracts the complexity of managing workflow state, timers, queues and retries and lets users focus on business logic.
Emails are one of the many business logic adjacent pieces that often get interwoven with our "business logic code" and they're often highly asyncronous (think of reminder emails for example) - temporal lets us interlieve our email logic with our business logic through without bloat like retry logic, scheduling etc. Its also agnostic about the deployment of our workflows so email workers can run entirely as services and be called remotely form our application code.
For this demo we have a single workflow called `signup` which, when started, will send the user a welcome email, sleep for 30 days and then send them a "your trial is expiring email".

## [MJML](https://mjml.io/):

MJML is an XML based templating language that is purpose built for emails. Emails are often called the "wild west" of frontend (which is really saying something). Most email clients do not support modern browser CSS or even HTML syntax. I really wouldn't advise writting emails in plain HTML since it can be very difficult to build complient emails (outlook HTML is pretty much an entirely new templating language in itself). MJML lets you write neat templates that will compile to email complient HTML and embedded CSS.
For this project, the MJML templates are built using gulp (because it had an mjml plugin, and is actually pretty clean).

## [nodejs/express](https://nodejs.org/en/):

I picked node because I knew it would be the fastest thing to get "working" and it would let me write everything in one language.

## [SendGrid](https://sendgrid.com/)

Actually sending emails requires a mail server which is not a trivial thing to setup (I don't even know if its possible for the average person/company) so we are beholden to third party services like AWS SES, mailgun, mailjet & SendGrid. Any of these will do in practise, I just chose SendGrid because they had a node package (so no SMTP), their startup process was straightforward and, most importantly, they had a free tier (100 emails per month).

## project-structure

Contains two packages:

- templates: the "frontend", mail templates built using MJML.
- mail-service: A cobbled together backend which consists of a temporal worker (and the workflow and activity definitions) & an express server which exposes a single `/signup` endpoint.

## Send Grid

To get this working you'll need a SendGrid account, signup for their free tier, register a single email (or a domain if you have one) and then generate an API key. Then copy the `.env.temlate` file in the `mail-service` package and rename it `.env` add your api key and the email address you registered.

## Getting started

This project is managed with [pnpm](https://pnpm.io/). Also `docker` & `docker compose` is required to run the temporal server locally.

To install dependencies:

```
pnpm i
```

To start the temporal server and its dependencies:

```
docker compose up
```

To build everything:

```
pnpm build all
```

To start the template dev server (to make changes to the templates and hot reload in the browser):

```
pnpm template:dev
```

> WARNING: in the current setup, any changes made to the templates while the dev server is running will be written directly to the build folder where the temporal worker looks for email templates at runtime (this is because I am lazy).

To run to temporal worker:

```
pnpm start:worker
```

To run the temporal server:

```
pnpm start:server
```

> It doesn't matter which order you start the server or the worker in (but both will need to connect to the temporal server so make sure the docker container is up).

Once all that's done, to fire off a request to the server and start the magic, you can run this request (maybe reduce the sleep time in the workflow to something reasonable, since you're probably not going to keep the temporal-server up for 30 days):

```
curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "RECIPIENT_NAME", "email": "RECIPIENT_EMAIL_ADDRESS"}' \
    http://localhost:5000/signup
```
