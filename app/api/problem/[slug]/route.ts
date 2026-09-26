import { env } from "@/src/configs/env.config";
import { destroy, read, update } from "@/src/configs/permission.config";
import {
  getPermissions,
  handleErrorResponse,
  isJWTCookie,
} from "@/src/utils/api.util";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import UnauthorizedError from "@/src/lib/UnauthorizedAPIError";
import PermissionDeniedError from "@/src/lib/PermissionDeniedAPIError";
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(read.problem)) {
      throw new PermissionDeniedError(read.problem);
    }

    const param = await params;

    if (!param.slug) {
      throw new APIError(
        `The problem reference is missing or invalid.`,
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

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/problem/${slug}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL ?? "",
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(update.problem)) {
      throw new PermissionDeniedError(update.problem);
    }

    const param = await params;

    if (!param.slug) {
      throw new APIError(
        `The problem reference is missing or invalid.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const body = await req.json();

    if (!("problem" in body)) {
      throw new APIError(
        `The problem details are required to update the problem.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const { problem } = body;

    const parser = ProblemSchema.safeParse(problem);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);
      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const token = cookies.user.token;
    const slug = param.slug;
    const url = env.SERVER_URL;

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/problem/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        Allow: `Actions ${permissions}`,
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(destroy.problem)) {
      throw new PermissionDeniedError(destroy.problem);
    }

    const url = env.SERVER_URL;
    const slug = (await params).slug;
    const token = cookies.user.token;

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/problem/${slug}?${query}`, {
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

    const APIResponse: APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
