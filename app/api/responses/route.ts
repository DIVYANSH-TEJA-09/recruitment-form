
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this endpoint is never cached

export async function GET() {
    try {
        // 1. Prepare Authentication
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
            throw new Error('Missing Google Credentials');
        }

        const privateKey = process.env.GOOGLE_PRIVATE_KEY
            .replace(/\\n/g, '\n')
            .replace(/"/g, '');

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);

        // 2. Load the document
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // 3. Fetch Rows
        const rows = await sheet.getRows();

        // 4. Map Rows to Dashboard Format
        // We need to map the sheet headers (e.g., "Full Name") back to our internal keys (e.g., "full_name")
        // or just use a consistent structure for the dashboard.
        const formattedSubmissions = rows.map((row) => ({
            timestamp: row.get('Timestamp'),
            full_name: row.get('Full Name'),
            roll_number: row.get('Roll Number'),
            branch: row.get('Branch'),
            selected_track: row.get('Selected Track'),
            email: row.get('Email'),
            phone: row.get('Phone'),
            // We can add more fields if needed for detailed view later
        }));

        return NextResponse.json({ success: true, data: formattedSubmissions });

    } catch (error: any) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
    }
}
