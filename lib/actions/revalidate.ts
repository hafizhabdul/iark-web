'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateManagement() {
    try {
        // Hapus cache berdasarkan tag 'management'
        revalidateTag('management');

        // Pastikan halaman-halaman terkait di-render ulang
        revalidatePath('/', 'layout');
        revalidatePath('/tentang', 'page');
        revalidatePath('/bidang', 'page');

        return { success: true };
    } catch (error) {
        console.error('Revalidation error:', error);
        return { success: false };
    }
}
