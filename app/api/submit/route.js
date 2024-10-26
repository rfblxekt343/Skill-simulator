import { PrismaClient } from '@prisma/client';

const globalForPrisma = global; // Use the global object directly

// Create the Prisma client and assign it to the global object
export const prisma = globalForPrisma.prisma || new PrismaClient();

// Assign the Prisma client to the global object in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function POST(request) {
  const { fullName, idNumber, course, role } = await request.json();

  // Simple validation
  if (!fullName || !idNumber || !role) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
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
    
    return new Response(JSON.stringify({ message: 'User processed successfully!', user }), {
      status: 201, // Changed to 201 for created
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing user data for:', { fullName, idNumber, role, error });
    return new Response(JSON.stringify({ message: 'Error processing user data', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

