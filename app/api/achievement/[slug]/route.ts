import { env } from "@/src/configs/env.config";
import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const url = env.SERVER_URL;
    const token = cookies.user.token;
    const slug = (await params).slug;

    if (!slug) {
      throw new ApiError(`Invalid parameter passed.`, StatusCodes.BAD_REQUEST);
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/achievement/${slug}?${query}`, {
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

    const apiResponse: ApiResponse = handleErrorResponse(error);

    return NextResponse.json(apiResponse, { status: apiResponse.status });
  }
}
