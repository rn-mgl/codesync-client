import { env } from "@/src/configs/env.config";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import { SubmissionSchema } from "@/src/schemas/submission.schema";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!("submission" in body)) {
      throw new APIError(`Invalid data passed.`, StatusCodes.BAD_REQUEST);
    }

    const { submission } = body;

    const parser = SubmissionSchema.safeParse(submission);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);

      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const url = env.SERVER_URL;

    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new APIError(
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
      throw new APIError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const APIResponse: APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new APIError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const request = new URL(req.url);
    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const searchParams = {
      problem: request.searchParams.get("problem") ?? "",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/submission?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new APIError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse);
  } catch (error) {
    console.log(error);

    const APIResponse: APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
