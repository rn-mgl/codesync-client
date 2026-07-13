import { env } from "@/src/configs/env.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import { TopicSchema } from "@/src/schemas/topic.schema";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new APIError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const body = await req.json();

    if (!("topic" in body)) {
      throw new APIError(`Invalid request.`, StatusCodes.BAD_REQUEST);
    }

    const topic = body.topic;

    const parser = TopicSchema.safeParse(topic);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);

      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const response = await fetch(`${url}/topic`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
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

    const APIResponse = handleErrorResponse(error);

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

    const token = cookies.user.token;
    const url = env.SERVER_URL;

    const response = await fetch(`${url}/topic`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Origin: env.APP_URL,
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new APIError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      data: resolve.data,
      success: true,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
