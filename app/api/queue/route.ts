import { env } from "@/src/configs/env.config";
import { APIResponse, ServerResponse } from "@/src/interfaces/api.interface";
import APIError from "@/src/lib/APIError";
import UnauthorizedError from "@/src/lib/UnauthorizedAPIError";
import { handleErrorResponse, isJWTCookie } from "@/src/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookies = await getToken({ req });

    if (!isJWTCookie(cookies)) {
      throw new UnauthorizedError();
    }

    const searchParams = new URL(req.url).searchParams;

    if (!searchParams.get("action")) {
      throw new APIError(`Missing job action.`, StatusCodes.BAD_REQUEST);
    }

    const token = cookies.user.token;
    const url = env.SERVER_URL;

    const query = searchParams.toString();

    const response = await fetch(`${url}/queue?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: env.APP_URL,
        "Content-Type": "application/json",
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
