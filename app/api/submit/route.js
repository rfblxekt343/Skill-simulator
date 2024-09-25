import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const { fullName, idNumber, course, role } = await request.json();

  try {
    // Upsert a user by idNumber: updates if the user exists, creates a new record if not
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

    return new Response(JSON.stringify({ message: 'User processed successfully!', user }), { status: 200 });
  } catch (error) {
    console.error('Error processing user data:', error);
    return new Response(JSON.stringify({ message: 'Error processing user data', error: error.message }), { status: 500 });
  }
}



// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();


// export async function POST(request) {
//   const { fullName, idNumber, course, role } = await request.json();

//   try {
//     // Upsert a user by idNumber: updates if the user exists, creates a new record if not
//     const form = await prisma.form.upsert({
//       where: { idNumber },
//       update: {
//         fullName,
//         course: role === 'sadir' ? course : '',
//         role,
//       },
//       create: {
//         fullName,
//         idNumber,
//         course: role === 'sadir' ? course : '',
//         role,
//       },
//     });

//     return new Response(JSON.stringify({ message: 'Form processed successfully!', form }), { status: 200 });
//   } catch (error) {
//     console.error('Error processing form data:', error);
//     return new Response(JSON.stringify({ message: 'Error processing form data', error: error.message }), { status: 500 });
//   }
// }
