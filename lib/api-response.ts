import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function apiError(message: string, code = "BAD_REQUEST", status = 400) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    { status }
  );
}
