async function scrape() {
  const url = 'https://www.youtube.com/@Squeezie';
  const r = await fetch(url);
  const t = await r.text();
  const match = t.match(/"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/);
  console.log(match ? match[1] : 'Not found');
}
scrape();
