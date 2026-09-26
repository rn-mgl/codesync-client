import { env } from "@/src/configs/env.config";
import { destroy, read, update } from "@/src/configs/permission.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import UnauthorizedError from "@/src/lib/UnauthorizedAPIError";
import PermissionDeniedError from "@/src/lib/PermissionDeniedAPIError";
import { TopicSchema } from "@/src/schemas/topic.schema";
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

    if (!cookies.user.permissions.includes(read.topic)) {
      throw new PermissionDeniedError(read.topic);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const permissions = getPermissions(cookies);
    const slug = (await params).slug;

    if (!slug) {
      throw new APIError(
        `The topic reference is missing or invalid.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const response = await fetch(`${url}/topic/${slug}?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        "Content-Type": "application/json",
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(update.topic)) {
      throw new PermissionDeniedError(update.topic);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const slug = (await params).slug;

    if (!slug) {
      throw new APIError(
        `The topic reference is missing or invalid.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const body = await req.json();

    if (!("topic" in body)) {
      throw new APIError(
        `The topic details are required to update the topic.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const topic = body.topic;

    const parser = TopicSchema.safeParse(topic);

    if (parser.error) {
      const prettifyError = z.prettifyError(parser.error);

      throw new APIError(prettifyError, StatusCodes.BAD_REQUEST);
    }

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/topic/${slug}?${query}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        "Content-Type": "application/json",
        Allow: `Actions ${permissions}`,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string }> },
) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new UnauthorizedError();
    }

    if (!cookies.user.permissions.includes(destroy.topic)) {
      throw new PermissionDeniedError(destroy.topic);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;
    const slug = (await params).slug;

    const searchParams = {
      lookup: "slug",
    };

    const query = new URLSearchParams(searchParams).toString();

    const permissions = getPermissions(cookies);

    const response = await fetch(`${url}/topic/${slug}?${query}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        "Content-Type": "application/json",
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
