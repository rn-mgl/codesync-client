import { ApiResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { VerifySchema } from "@/src/schemas/auth.schema";
import { ServerResponse } from "@/interfaces/api.interface";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/src/configs/env.config";
import { handleErrorResponse } from "@/src/utils/api.util";

export async function PATCH(req: NextRequest) {
  try {
    const url = env.SERVER_URL;

    const body = await req.json();

    if (!("token" in body) || typeof body.token !== "string") {
      throw new ApiError(
        `You are not allowed to perform this operation.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const parser = VerifySchema.safeParse(body);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new ApiError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const response = await fetch(`${url}/auth/verify`, {
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

    const apiResponse: ApiResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
    };

    return NextResponse.json(apiResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const apiResponse: ApiResponse = handleErrorResponse(error);

    return NextResponse.json(apiResponse, { status: apiResponse.status });
  }
}
