import { env } from "@/src/configs/env.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import { ForgotSchema } from "@/src/schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const url = env.SERVER_URL;

    const body = await req.json();

    const { credentials } = body;

    const parser = ForgotSchema.safeParse(credentials);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const response = await fetch(`${url}/auth/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new APIError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (err) {
    console.log(err);

    const isAPIError = err instanceof APIError;

    const APIResponse: APIResponse = {
      success: false,
      message: isAPIError ? err.message : "An unexpected error occurred.",
      status: isAPIError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    };

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
