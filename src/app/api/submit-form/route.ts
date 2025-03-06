import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; 

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { email, phone } = data;
    
    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
    }

    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    console.log(existingUser)

    if (existingUser) {
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
    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}