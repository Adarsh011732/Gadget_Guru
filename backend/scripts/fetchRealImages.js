import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { mobiles } from '../src/data/mobiles.js';
import { laptops } from '../src/data/laptops.js';
import { tablets, headphones, smartwatches } from '../src/data/accessories.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERP_API_BASE = 'https://serpapi.com/search.json';
const apiKey = process.env.SERP_API_KEY;

const targetFiles = [
  { path: '../src/data/mobiles.js', array: mobiles, name: 'mobiles' },
  { path: '../src/data/laptops.js', array: laptops, name: 'laptops' },
  { path: '../src/data/accessories.js', arrays: [tablets, headphones, smartwatches], name: 'accessories' }
];

async function fetchProductImage(productName) {
  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: productName,
    location: 'India',
    hl: 'en',
    gl: 'in',
    api_key: apiKey,
    num: 3,
  });

  try {
    const res = await fetch(`${SERP_API_BASE}?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.shopping_results || [];

    for (const item of results) {
      if (item.thumbnail) {
        return item.thumbnail;
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

async function run() {
  console.log('🔍 Fetching real product images...');
  
  for (const fileDef of targetFiles) {
    const absPath = path.resolve(__dirname, fileDef.path);
    let fileContent = fs.readFileSync(absPath, 'utf8');
    let updatedCount = 0;

    const arraysToProcess = fileDef.arrays || [fileDef.array];
    
    for (const arr of arraysToProcess) {
      for (const product of arr) {
        console.log(`Fetching image for: ${product.name}`);
        const newImage = await fetchProductImage(product.name);
        
        if (newImage) {
          // Replace by string index matching
          const idIndex = fileContent.indexOf(`id: "${product.id}"`);
          if (idIndex !== -1) {
            const imageIndex = fileContent.indexOf('image: "', idIndex);
            if (imageIndex !== -1 && imageIndex < idIndex + 1000) {
              const startQuote = imageIndex + 8;
              const endQuote = fileContent.indexOf('"', startQuote);
              
              if (endQuote !== -1) {
                fileContent = fileContent.substring(0, startQuote) + newImage + fileContent.substring(endQuote);
                updatedCount++;
                console.log(` ✅ Updated ${product.id}`);
              }
            }
          }
        }
        // sleep 600ms to respect rate limit
        await new Promise(r => setTimeout(r, 600));
      }
    }
    
    fs.writeFileSync(absPath, fileContent);
    console.log(`💾 Saved ${updatedCount} images to ${fileDef.name}`);
  }
  
  console.log('🎉 Done fetching images!');
}

run();
