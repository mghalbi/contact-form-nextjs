
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

const { WEBHOOK_URL, ADMIN_EMAIL } = process.env;

export async function POST(request: Request) {
  try {
    // Check if the user is authenticated
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.email || '';
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Email or phone is required and cannot be empty' }, { status: 400 });
    }

    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (email === ADMIN_EMAIL) {
      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone) {
        return NextResponse.json({ error: 'Abbiamo già nel nostro database il suo numero o la sua mail, se non riceve i nostri messaggi provi a contattarci telefonicamente.' }, { status: 400 });
      }
    } else if (existingUser) {
      return NextResponse.json({ error: 'Abbiamo già nel nostro database il suo numero o la sua mail, se non riceve i nostri messaggi provi a contattarci telefonicamente.' }, { status: 400 });
    }

    // Send data to webhook
    const response = await fetch(WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, phone: phone, email: email, timestamp: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error('Webhook call failed');

    // Insert new user into the database
    await prisma.user.create({ data: { email, name, phone } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting form:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}