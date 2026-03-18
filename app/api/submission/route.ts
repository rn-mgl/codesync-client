import { env } from "@/src/configs/env.config";
import { isJWTCookie } from "@/src/helpers/api.helper";
import { ApiResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { SubmissionSchema } from "@/src/schemas/submission.schema";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!("submission" in body)) {
      throw new ApiError(`Invalid data passed.`, StatusCodes.BAD_REQUEST);
    }

    const { submission } = body;

    const parser = SubmissionSchema.safeParse(submission);

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

    const response = await fetch(`${url}/submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies?.user.token}`,
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
  } catch (err) {
    console.log(err);

    const isApiError = err instanceof ApiError;

    const apiResonse: ApiResponse = {
      success: false,
      status: isApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
      message: isApiError ? err.message : "An unexpected error occurred.",
    };

    return NextResponse.json(apiResonse);
  }
}
