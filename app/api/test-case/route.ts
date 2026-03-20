import { env } from "@/src/configs/env.config";
import { handleErrorResponse, isJWTCookie } from "@/src/helpers/api.helper";
import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const body = await req.json();

    if (!("testCase" in body)) {
      throw new ApiError(`Invalid values passed.`, StatusCodes.BAD_REQUEST);
    }

    const response = await fetch(`${url}/test-case`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
      status: response.status,
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.log(error);

    const apiResponse = handleErrorResponse(error);

    return NextResponse.json(apiResponse);
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const request = new URL(req.url);
    const token = cookies.user.token;
    const url = env.SERVER_URL;

    const searchParams = {
      problem: request.searchParams.get("problem") ?? "",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/test-case?${query}`, {
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
      status: response.status,
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.log(error);

    const apiResponse = handleErrorResponse(error);

    return NextResponse.json(apiResponse);
  }
}
