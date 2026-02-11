import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function check() {
    let envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        envPath = path.join(process.cwd(), '.env');
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const env: Record<string, string> = {};
    envContent.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            env[key.trim()] = values.join('=').trim();
        }
    });

    const supabase = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: story, error } = await supabase
        .from('stories')
        .select('title, slug, status')
        .eq('slug', 'membangun-startup-edukasi-pelosok-negeri')
        .single();

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('--- STORY FOUND ---');
    console.log(JSON.stringify(story, null, 2));
}

check();
