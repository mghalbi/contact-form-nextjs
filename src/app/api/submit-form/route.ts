import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma"; 

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request: Request) {
  try {
    
    // Check if the user is authenticated
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session?.email || "" ;
    const data = await request.json();
    const { name, phone } = data;
    
    if (!name || !phone) {
      return NextResponse.json({ error: 'Email or phone is required and cannot be empty' }, { status: 400 });
    }

    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser && email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Email or phone number already exists' }, { status: 400 });
    }

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

    // Insert new user into the database
    await prisma.user.create({  
      data: {
        email,
        name,
        phone,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error submitting form:', error.message);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
