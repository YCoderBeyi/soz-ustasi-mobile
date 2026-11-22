// Builds the standalone Soz Ustasi website (the root of its OWN domain) into site-dist/.
// Single sources stay in public/: privacy.html, app-ads.txt, favicon.png. This script only copies them and adds the landing page,
// so the policy and the AdMob line are never edited in two places.
//
//   npm run build:site                 -> site-dist/
//   SITE_DOMAIN=sozustasi.app npm run build:site   -> also writes site-dist/CNAME for a custom domain
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* global console, process */

const root = process.cwd();
const out = join(root, 'site-dist');
const APP_ADS_LINE = 'google.com, pub-2784764635828379, DIRECT, f08c47fec0942fa0';

const appAds = readFileSync(join(root, 'public', 'app-ads.txt'), 'utf8').trim();
if (appAds !== APP_ADS_LINE) throw new Error(`public/app-ads.txt must be exactly: ${APP_ADS_LINE}`);

const privacy = readFileSync(join(root, 'public', 'privacy.html'), 'utf8');
if (!privacy.includes('13 yaşın altındaki çocuklara yönelik değildir')) throw new Error('public/privacy.html is missing the 13+ statement.');
if (/Tırı\s*Vırı/i.test(privacy)) throw new Error('public/privacy.html mentions another app; the Soz Ustasi site must stay separate.');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

copyFileSync(join(root, 'public', 'privacy.html'), join(out, 'privacy.html'));
writeFileSync(join(out, 'app-ads.txt'), `${APP_ADS_LINE}\n`);
if (existsSync(join(root, 'public', 'favicon.png'))) copyFileSync(join(root, 'public', 'favicon.png'), join(out, 'favicon.png'));
writeFileSync(join(out, '.nojekyll'), '');
if (process.env.SITE_DOMAIN) writeFileSync(join(out, 'CNAME'), `${process.env.SITE_DOMAIN.trim()}\n`);

writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Söz Ustası - Kelime Oyunu</title>
  <meta name="description" content="Söz Ustası: harfleri birleştir, kelimeleri bul, her seviyede küçük bir tarih hikâyesi keşfet." />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <style>
    :root { color-scheme: dark; font-family: Georgia, serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0d1321; color: #f4ecd8; text-align: center; padding: 24px; }
    main { max-width: 520px; }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 8vw, 3rem); color: #f2cf77; }
    p { line-height: 1.6; color: #cfd8e3; }
    a { color: #f2cf77; }
  </style>
</head>
<body>
  <main>
    <h1>Söz Ustası</h1>
    <p>Harfleri birleştir, kelimeleri bul ve her seviyede küçük bir tarih hikâyesi keşfet. Android için Google Play'de.</p>
    <p><a href="/privacy.html">Gizlilik Politikası</a></p>
  </main>
</body>
</html>
`);

console.log(`site-dist ready: ${['index.html', 'privacy.html', 'app-ads.txt', 'favicon.png', '.nojekyll', ...(process.env.SITE_DOMAIN ? ['CNAME'] : [])].join(', ')}`);
