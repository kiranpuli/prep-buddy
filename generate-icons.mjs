import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// PrepBuddy Logo SVG - Rocket with code brackets
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8"/>
      <stop offset="100%" style="stop-color:#818cf8"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24"/>
      <stop offset="50%" style="stop-color:#f97316"/>
      <stop offset="100%" style="stop-color:#ef4444"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="url(#bgGrad)"/>
  
  <!-- Decorative code brackets -->
  <text x="80" y="280" font-family="monospace" font-size="120" font-weight="bold" fill="#38bdf8" opacity="0.3">&lt;</text>
  <text x="360" y="280" font-family="monospace" font-size="120" font-weight="bold" fill="#818cf8" opacity="0.3">/&gt;</text>
  
  <!-- Rocket body -->
  <g filter="url(#glow)">
    <!-- Main rocket body -->
    <path d="M256 100 
             C256 100 320 160 320 260 
             L320 320 
             L192 320 
             L192 260 
             C192 160 256 100 256 100Z" 
          fill="url(#rocketGrad)"/>
    
    <!-- Rocket window -->
    <circle cx="256" cy="200" r="32" fill="#0f172a"/>
    <circle cx="256" cy="200" r="24" fill="#38bdf8" opacity="0.6"/>
    <circle cx="248" cy="192" r="8" fill="white" opacity="0.8"/>
    
    <!-- Left fin -->
    <path d="M192 280 L140 340 L192 320 Z" fill="url(#rocketGrad)"/>
    
    <!-- Right fin -->
    <path d="M320 280 L372 340 L320 320 Z" fill="url(#rocketGrad)"/>
    
    <!-- Rocket bottom -->
    <path d="M200 320 L200 360 L256 380 L312 360 L312 320 Z" fill="#64748b"/>
  </g>
  
  <!-- Flame -->
  <g filter="url(#glow)">
    <path d="M220 360 
             Q220 400 256 440 
             Q292 400 292 360 
             L256 380 Z" 
          fill="url(#flameGrad)"/>
    <path d="M235 365 
             Q235 390 256 420 
             Q277 390 277 365 
             L256 375 Z" 
          fill="#fef08a" opacity="0.8"/>
  </g>
  
  <!-- Stars -->
  <circle cx="100" cy="120" r="4" fill="white" opacity="0.8"/>
  <circle cx="420" cy="100" r="3" fill="white" opacity="0.6"/>
  <circle cx="400" cy="400" r="4" fill="white" opacity="0.7"/>
  <circle cx="120" cy="380" r="3" fill="white" opacity="0.5"/>
  <circle cx="80" cy="200" r="2" fill="white" opacity="0.6"/>
  <circle cx="440" cy="240" r="2" fill="white" opacity="0.5"/>
</svg>`;

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write base SVG
const svgPath = path.join(publicDir, 'icon.svg');
fs.writeFileSync(svgPath, svgContent);
console.log('✓ Created icon.svg');

// Check if we have the tools to convert SVG to PNG
let canConvert = false;
try {
  execSync('which convert', { stdio: 'ignore' });
  canConvert = true;
} catch {
  try {
    execSync('which rsvg-convert', { stdio: 'ignore' });
    canConvert = true;
  } catch {
    console.log('⚠ No SVG to PNG converter found. Install ImageMagick or librsvg for PNG generation.');
    console.log('  brew install imagemagick');
    console.log('  or');
    console.log('  brew install librsvg');
  }
}

if (canConvert) {
  // Generate PNG icons
  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
    try {
      // Try rsvg-convert first (better quality)
      execSync(`rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${outputPath}"`, { stdio: 'ignore' });
    } catch {
      // Fallback to ImageMagick
      try {
        execSync(`convert -background none -resize ${size}x${size} "${svgPath}" "${outputPath}"`, { stdio: 'ignore' });
      } catch (e) {
        console.log(`✗ Failed to generate ${size}x${size} icon`);
        continue;
      }
    }
    console.log(`✓ Created icon-${size}x${size}.png`);
  }

  // Create favicon.ico (multi-size)
  const icoSizes = [16, 32, 48];
  const icoPaths = icoSizes.map(s => path.join(publicDir, `icon-${s}x${s}.png`)).filter(p => fs.existsSync(p));
  if (icoPaths.length > 0) {
    try {
      execSync(`convert ${icoPaths.join(' ')} "${path.join(publicDir, 'favicon.ico')}"`, { stdio: 'ignore' });
      console.log('✓ Created favicon.ico');
    } catch {
      console.log('✗ Failed to create favicon.ico');
    }
  }

  // Create apple-touch-icon
  const applePath = path.join(publicDir, 'icon-180x180.png');
  if (fs.existsSync(applePath)) {
    fs.copyFileSync(applePath, path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');
  }
}

// Create web manifest
const manifest = {
  name: 'PrepBuddy',
  short_name: 'PrepBuddy',
  description: 'Crack FAANG interviews with confidence. Track company-prioritized LeetCode problems.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0f172a',
  theme_color: '#38bdf8',
  icons: [
    { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('✓ Created manifest.json');

console.log('\nDone! Remember to update index.html with favicon links.');
