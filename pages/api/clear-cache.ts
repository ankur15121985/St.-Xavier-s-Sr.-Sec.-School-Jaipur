import { NextResponse } from 'next/server';
import { fetchServerData } from '@/lib/db';

export async function GET() {
  try {
    // Calling fetchServerData(true) forces a bypass of the cache and refills it
    const data = await fetchServerData(true);
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared and data re-fetched from Supabase successfully.',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
