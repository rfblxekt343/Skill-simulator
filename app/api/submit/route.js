import { PrismaClient } from '@prisma/client'

// Create a single PrismaClient instance and export it
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request) {
  const { fullName, idNumber, course, role } = await request.json();
  
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
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing user data:', error);
    return new Response(JSON.stringify({ message: 'Error processing user data', error: error.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}