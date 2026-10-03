# ChatGPT v2612

A simple local PC-hosted real-time chat.

## Run locally

```bash
npm install
npm start
```

User: http://localhost:3000  
Host: http://localhost:3000/host.html

## Temporary internet access

With the app running, open another terminal:

```bash
cloudflared tunnel --url http://localhost:3000
```

Use the `https://...trycloudflare.com` URL printed by cloudflared.

This temporary URL is for testing. Anyone who has the URL can reach the app, so don't post it publicly.
