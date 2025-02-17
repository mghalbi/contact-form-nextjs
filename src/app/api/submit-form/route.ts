import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await fetch(WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Webhook call failed');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}