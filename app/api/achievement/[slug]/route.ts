import { env } from "@/src/configs/env.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import ApiError from "@/src/lib/ApiError";
import { AchievementSchema } from "@/src/schemas/achievement.schema";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
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

    const url = env.SERVER_URL;
    const token = cookies.user.token;
    const slug = (await params).slug;

    if (!slug) {
      throw new ApiError(`Invalid parameter passed.`, StatusCodes.BAD_REQUEST);
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/achievement/${slug}?${query}`, {
      method: "GET",
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

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const slug = (await params).slug;

    if (!slug) {
      throw new ApiError(`Invalid request.`, StatusCodes.BAD_REQUEST);
    }

    const formData = await req.formData();

    const parsed = Object.fromEntries(formData.entries());

    const parser = AchievementSchema.safeParse(parsed);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);

      throw new ApiError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    formData.set("lookup", "slug");

    const response = await fetch(`${url}/achievement/${slug}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
      },
      body: formData,
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new ApiError(resolve.message, response.status);
    }

    const APIResponse: APIResponse<typeof resolve.data> = {
      success: resolve.success,
      data: resolve.data,
    };

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const APIResponse: APIResponse = handleErrorResponse(error);

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
        `You are unauthorized to proceed.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;

    const slug = (await params).slug;

    if (!slug) {
      throw new ApiError(`Invalid request.`, StatusCodes.BAD_REQUEST);
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/achievement/${slug}?${query}`, {
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

    const APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
