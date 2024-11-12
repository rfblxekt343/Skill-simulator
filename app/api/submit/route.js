import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  console.log("MongoDB URI:", process.env.MONGODB_URI);
  const { fullName, idNumber, course, role } = await request.json();

  // Simple validation
  if (!fullName || !idNumber || !role) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.upsert({
      where: { idNumber },
      update: {
        fullName,
        course: role === 'sadir' ? course : '',
        role,
      },
      create: {
        fullName,
        idNumber,
        course: role === 'sadir' ? course : '',
        role,
      },
    });
    
    return NextResponse.json({ message: 'User processed successfully!', user }, { status: 201 });
  } catch (error) {
    console.error('Error processing user data for:', { fullName, idNumber, role, error });
    return NextResponse.json({ message: 'Error processing user data', error: error.message }, { status: 500 });
  }
}
