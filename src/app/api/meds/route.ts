import { promises as fs } from 'fs';
import path from 'path';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export async function GET() {
    const buf = await fs.readFile(dataPath('meds.json'));

    return buf.toString();
}