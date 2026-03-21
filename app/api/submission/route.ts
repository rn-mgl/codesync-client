import { env } from "@/src/configs/env.config";
import { handleErrorResponse, isJWTCookie } from "@/src/helpers/api.helper";
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
    };

    return NextResponse.json(apiResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const apiResponse: ApiResponse = handleErrorResponse(error);

    return NextResponse.json(apiResponse, { status: apiResponse.status });
  }
}
