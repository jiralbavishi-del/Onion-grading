import fs from 'fs';
import path from 'path';
import https from 'https';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const varieties = [
  { id: 'nashik_red', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80' },
  { id: 'bhima_super', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80' },
  { id: 'bellary_red', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80' },
  { id: 'pune_fursungi', url: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&auto=format&fit=crop&q=80' },
  { id: 'bangalore_rose', url: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400&auto=format&fit=crop&q=80' },
  { id: 'agrifound_dark_red', url: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&auto=format&fit=crop&q=80' },
  { id: 'pusa_red', url: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&auto=format&fit=crop&q=80' },
  { id: 'white_onion', url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d39?w=400&auto=format&fit=crop&q=80' },
  { id: 'yellow_granex', url: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&auto=format&fit=crop&q=80' },
  { id: 'red_creole', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80' },
  { id: 'pusa_white_round', url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d39?w=400&auto=format&fit=crop&q=80' },
  { id: 'pusa_madhavi', url: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&auto=format&fit=crop&q=80' },
  { id: 'arka_kalyan', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80' },
  { id: 'agrifound_light_red', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80' },
  { id: 'other', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80' },
];

const samples = [
  { id: 'sprout_defect', url: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&auto=format&fit=crop&q=80' },
  { id: 'grade_a_bulb', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80' },
  { id: 'doubles_defect', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80' }
];

async function run() {
  for (const v of varieties) {
    const dest = path.join('public', 'varieties', `${v.id}.jpg`);
    try {
      await download(v.url, dest);
      console.log('Downloaded variety:', v.id);
    } catch (err) {
      console.error('Failed variety:', v.id, err.message);
    }
  }
  for (const s of samples) {
    const dest = path.join('public', 'samples', `${s.id}.jpg`);
    try {
      await download(s.url, dest);
      console.log('Downloaded sample:', s.id);
    } catch (err) {
      console.error('Failed sample:', s.id, err.message);
    }
  }
}

run();
