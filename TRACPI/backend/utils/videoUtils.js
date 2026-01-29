import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_PATH = path.join(__dirname, '../video_durations.json');

let cache = {};
try {
    if (fs.existsSync(CACHE_PATH)) {
        cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
} catch (error) {
    console.error('Error loading duration cache:', error);
}

const normalizeVideoId = (id) => {
    if (!id) return '';
    let str = String(id).trim();

    // Handle Vimeo
    const vimeoMatch = str.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return vimeoMatch[1];

    // If it's just a number, assume it's a Vimeo ID
    if (/^\d+$/.test(str)) return str;

    return str;
};

export const fetchVideoDuration = async (videoID) => {
    const id = normalizeVideoId(videoID);
    if (!id) return 0;

    if (cache[id]) return cache[id];

    try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`);
        if (!response.ok) throw new Error('Vimeo API error');

        const data = await response.json();
        const durationMins = Math.round(data.duration / 60) || 1; // Minimum 1 min

        cache[id] = durationMins;

        // Periodically save cache or save on every new entry
        fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));

        return durationMins;
    } catch (error) {
        console.warn(`Could not fetch duration for video ${id}:`, error.message);
        return 15; // Fallback to 15 mins for unknown videos
    }
};

export const calculateSectionDuration = async (units) => {
    if (!units || !units.length) return 0;

    const durations = await Promise.all(
        units.map(unit => fetchVideoDuration(unit.videoID || unit.videoId))
    );

    return durations.reduce((total, d) => total + d, 0);
};

export const calculateCourseDuration = async (sections) => {
    if (!sections || !sections.length) return 0;
    const sectionDurations = await Promise.all(
        sections.map(s => calculateSectionDuration(s.units))
    );
    return sectionDurations.reduce((total, d) => total + d, 0);
};
