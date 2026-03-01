import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { ProblemSchema } from "@/src/schemas/problem.schema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getToken } from "next-auth/jwt";
import { isJWTCookie } from "@/src/helpers/api.helper";
import { env } from "@/src/configs/env.config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!("problem" in body)) {
      throw new ApiError(`Invalid data passed.`, StatusCodes.BAD_REQUEST);
    }

    const { problem } = body;

    const parser = ProblemSchema.safeParse(problem);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new ApiError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const url = env.SERVER_URL;
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const response = await fetch(`${url}/problem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.user.token}`,
        Origin: env.APP_URL,
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
      status: response.status,
    };

    return NextResponse.json(apiResponse);
  } catch (err) {
    console.error(err);

    const isApiError = err instanceof ApiError;

    const apiResponse: ApiResponse = {
      success: false,
      message: isApiError ? err.message : "An unexpected error occurred.",
      status: isApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    };

    return NextResponse.json(apiResponse);
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are not allowed to proceed with this request.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const url = env.SERVER_URL;

    const response = await fetch(`${url}/problem`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.user.token}`,
        Origin: env.APP_URL,
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
      status: response.status,
    };

    return NextResponse.json(apiResponse);
  } catch (err) {
    console.log(err);

    const isApiError = err instanceof ApiError;

    const apiResponse: ApiResponse = {
      success: false,
      message: isApiError ? err.message : "An unexpected error occurred.",
      status: isApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    };

    return NextResponse.json(apiResponse);
  }
}
