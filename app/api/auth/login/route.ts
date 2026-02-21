import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { LoginSchema } from "@/src/schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const url = process.env.SERVER_URL;

    const body = await req.json();

    const { credentials } = body;

    const parser = LoginSchema.safeParse({ ...credentials });

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new ApiError(prettifyError, StatusCodes.FORBIDDEN);
    }

    const response = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, resolve.status);
    }

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
      status: StatusCodes.OK,
    };

    return NextResponse.json(apiResponse);
  } catch (error: unknown) {
    const isApiError = error instanceof ApiError;

    const apiResponse: ApiResponse = {
      success: false,
      message: isApiError ? error.message : "An unexpected error occurred",
      status: isApiError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    };

    return NextResponse.json(apiResponse);
  }
}
