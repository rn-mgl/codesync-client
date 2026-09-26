import { env } from "@/src/configs/env.config";
import { destroy, read, update } from "@/src/configs/permission.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import UnauthorizedError from "@/src/lib/UnauthorizedAPIError";
import PermissionDeniedError from "@/src/lib/PermissionDeniedAPIError";
import { AchievementSchema } from "@/src/schemas/achievement.schema";
import {
  getPermissions,
  handleErrorResponse,
  isJWTCookie,
} from "@/src/utils/api.util";
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(read.achievement)) {
      throw new PermissionDeniedError(read.achievement);
    }

    const url = env.SERVER_URL;
    const token = cookies.user.token;
    const slug = (await params).slug;

    if (!slug) {
      throw new APIError(
        `The achievement reference is missing or invalid.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/achievement/${slug}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        Allow: `Actions ${permissions}`,
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(update.achievement)) {
      throw new PermissionDeniedError(update.achievement);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const slug = (await params).slug;

    if (!slug) {
      throw new APIError(
        `The achievement reference is missing or invalid.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const body = await req.json();

    if (!("achievement" in body)) {
      throw new APIError(
        `The achievement details are required to update the achievement.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const achievement = body.achievement;

    const parser = AchievementSchema.safeParse(achievement);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);

      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/achievement/${slug}?${query}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        "Content-Type": "application/json",
        Allow: `Actions ${permissions}`,
      },
      body: JSON.stringify({ achievement }),
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(destroy.achievement)) {
      throw new PermissionDeniedError(destroy.achievement);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;

    const slug = (await params).slug;

    if (!slug) {
      throw new APIError(
        `The achievement reference is missing or invalid.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/achievement/${slug}?${query}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        Allow: `Actions ${permissions}`,
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

    return NextResponse.json(APIResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
