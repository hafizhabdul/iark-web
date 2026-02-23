'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateManagement() {
    revalidateTag('management');
    revalidatePath('/', 'layout');
    revalidatePath('/tentang', 'page');
    revalidatePath('/bidang', 'page');
}
