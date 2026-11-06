# Nor’easters website — multipage draft

Open `index.html` for the homepage. For the roster to load correctly, serve the folder with `python3 -m http.server 8000` and visit http://localhost:8000.

## Pages
- Home (`index.html`)
- About Us (`about.html`)
- Roster (`roster.html`)
- Members (`members.html`) — placeholder only; **no authentication is implemented**
- Contact (`contact.html`) — form is **not connected**; it does not send messages

## Content and CMS
The roster lives in `content/members.json`, which can be managed by a GitHub-backed CMS. Other page text is currently HTML and needs to be moved to CMS-managed fields before nontechnical editing is fully enabled. The site is not deployed or connected to GitHub/Cloudflare.

The logo image is the supplied Nor’easters artwork. Member images and biographies are placeholders.
