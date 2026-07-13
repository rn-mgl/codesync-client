import { env } from "@/src/configs/env.config";
import { handleErrorResponse } from "@/src/utils/api.util";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
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
      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
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
      throw new APIError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (err) {
    console.log(err);

    const APIResponse: APIResponse = handleErrorResponse(err);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
