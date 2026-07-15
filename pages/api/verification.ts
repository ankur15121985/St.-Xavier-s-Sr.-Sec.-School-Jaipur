import { NextApiRequest, NextApiResponse } from 'next';
import { fetchServerData } from '../../src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, hash, key } = req.query;
  const data = await fetchServerData();
  const settings = data?.settings || {};

  if (type === 'google' && hash) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`google-site-verification: google${hash}.html`);
  }

  if (type === 'bing' && settings.bingWebmasterKey) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(`<?xml version="1.0" encoding="utf-8"?>
<users>
  <user>${settings.bingWebmasterKey}</user>
</users>`);
  }

  if (type === 'indexnow' && key) {
    const k = (key as string).replace(/\.txt$/i, '');
    if (settings.indexNowKey && (settings.indexNowKey === k || k.toLowerCase() === 'indexnow')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(settings.indexNowKey);
    }
  }

  return res.status(404).end();
}
