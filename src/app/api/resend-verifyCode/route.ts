import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, verifyCode, verifyCodeExpiry } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    
    await prisma.user.update({
        where: { email },
        data: { emailVerifyCode: verifyCode, verifyCodeExpiry: verifyCodeExpiry },
    });

    return Response.json(
        { success: true, message: 'Verification Code re-sent successfully' },
        { status: 200 }
    );
  } catch (error) {
    console.log('Error verifying user:', error);
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}