async function scrape() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const r = await fetch(url);
  const t = await r.text();
  const match = t.match(/"viewCount":"(\d+)"/);
  console.log(match ? match[1] + ' views' : 'Not found');
}
scrape();
