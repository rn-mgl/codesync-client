import { ApiResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { RegisterSchema } from "@/src/schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const url = process.env.SERVER_URL;

    const body = await req.json();

    const { credentials } = body;

    const parser = RegisterSchema.safeParse(credentials);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new ApiError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const response = await fetch(`${url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resolve = await response.json();

    const apiResponse: ApiResponse<typeof resolve> = {
      success: true,
      data: resolve,
      status: StatusCodes.OK,
    };

    return NextResponse.json(apiResponse);
  } catch (err) {
    console.log(err);

    const isApiError = err instanceof ApiError;

    const apiResponse: ApiResponse = {
      success: false,
      message: isApiError ? err.message : "An unexpected error occurred",
      status: isApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    };

    return NextResponse.json(apiResponse);
  }
}
