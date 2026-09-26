import { env } from "@/src/configs/env.config";
import { create, read } from "@/src/configs/permission.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import UnauthorizedError from "@/src/lib/UnauthorizedAPIError";
import PermissionDeniedError from "@/src/lib/PermissionDeniedAPIError";
import {
  getPermissions,
  handleErrorResponse,
  isJWTCookie,
} from "@/src/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(create.permission)) {
      throw new PermissionDeniedError(create.permission);
    }

    const body = await req.json();

    if (!("permission" in body)) {
      throw new APIError(`Invalid request.`, StatusCodes.BAD_REQUEST);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/permission`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Origin: env.APP_URL,
        Allow: `Actions ${permissions}`,
      },
      body: JSON.stringify(body),
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new APIError(resolve.message, response.status);
    }

    const apiResponse: APIResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(apiResponse, { status: response.status });
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
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(read.permission)) {
      throw new PermissionDeniedError(read.permission);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const permissions = getPermissions(cookies);
    const params = new URL(req.url).searchParams;

    const query = params.toString();

    console.log(query);

    const response = await fetch(`${url}/permission?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Origin: env.APP_URL,
        Allow: `Actions ${permissions}`,
      },
    });

    const resolve: ServerResponse = await response.json();

    if (!resolve.success) {
      throw new APIError(resolve.message, response.status);
    }

    const apiResponse: APIResponse<typeof resolve.data> = {
      success: true,
      data: resolve.data,
    };

    return NextResponse.json(apiResponse, { status: response.status });
  } catch (error) {
    console.log(error);

    const APIResponse: APIResponse = handleErrorResponse(error);

    return NextResponse.json(APIResponse, { status: APIResponse.status });
  }
}
