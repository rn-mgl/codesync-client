import { env } from "@/src/configs/env.config";
import { handleErrorResponse } from "@/src/helpers/api.helper";
import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { RegisterSchema } from "@/src/schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const url = env.SERVER_URL;

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

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
    };

    return NextResponse.json(apiResponse, { status: response.status });
  } catch (err) {
    console.log(err);

    const apiResponse: ApiResponse = handleErrorResponse(err);

    return NextResponse.json(apiResponse, { status: apiResponse.status });
  }
}
