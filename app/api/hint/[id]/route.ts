import { env } from "@/src/configs/env.config";
import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id?: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const id = (await params).id;

    const response = await fetch(`${url}/hint/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(apiResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const apiResponse = handleErrorResponse(error);

    return NextResponse.json(apiResponse, { status: apiResponse.status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
  } catch (error) {}
}

export async function DELETE(req: NextRequest) {
  try {
  } catch (error) {}
}
