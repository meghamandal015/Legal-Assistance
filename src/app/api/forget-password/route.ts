import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.update({
        where: {
            email,
        },
        data: {
            password: hashedPassword,
        },
    });

    return Response.json(
      { success: true, message: 'Password Re-set successfully.' },
      { status: 200 }
  );
  } catch (error) {
    console.error('Error verifying user:', error);
    
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}