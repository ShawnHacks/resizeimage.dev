const http = require('http');

http.get('http://localhost:3000/en', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Strip HTML tags and scripts
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');

    function countMatches(str, pattern) {
      const regex = new RegExp('\\b' + pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
      const matches = str.match(regex);
      return matches ? matches.length : 0;
    }

    const words = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(/\s+/).filter(Boolean);

    console.log("=== Rendered HTML SEO Counts ===");
    console.log("Total words in body text:", words.length);
    console.log("Occurrences of 'resize image':", countMatches(text, "resize image"));
    console.log("Occurrences of 'image resizer':", countMatches(text, "image resizer"));
  });
}).on('error', (err) => {
  console.error("Error fetching local server:", err.message);
});
