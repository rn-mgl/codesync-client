import { env } from "@/src/configs/env.config";
import { handleErrorResponse } from "@/src/utils/api.util";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { ResetSchema } from "@/src/schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PATCH(req: NextRequest) {
  try {
    const url = env.SERVER_URL;

    const body = await req.json();

    const { credentials } = body;

    const parser = ResetSchema.safeParse(credentials);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new ApiError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const response = await fetch(`${url}/auth/reset`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      data: resolve.data,
      success: resolve.success,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (err) {
    console.log(err);

    const APIResponse: APIResponse = handleErrorResponse(err);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
