import { env } from "@/src/configs/env.config";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { ProblemSchema } from "@/src/schemas/problem.schema";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const param = await params;

    if (!param.slug) {
      throw new ApiError(
        `Invalid request, missing slug.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const slug = (await params).slug;

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/problem/${slug}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL ?? "",
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (err) {
    console.log(err);

    const APIResponse = handleErrorResponse(err);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const param = await params;

    if (!param.slug) {
      throw new ApiError(
        `Invalid request, missing slug.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const body = await req.json();

    if (!("problem" in body)) {
      throw new ApiError(`Invalid data passed.`, StatusCodes.BAD_REQUEST);
    }

    const { problem } = body;

    const parser = ProblemSchema.safeParse(problem);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new ApiError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const token = cookies.user.token;
    const slug = param.slug;
    const url = env.SERVER_URL;

    const response = await fetch(`${url}/problem/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (err) {
    console.error(err);

    const APIResponse = handleErrorResponse(err);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new ApiError(
        `You are unauthenticated to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const url = env.SERVER_URL;
    const slug = (await params).slug;
    const token = cookies.user.token;

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/problem/${slug}?${query}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
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
