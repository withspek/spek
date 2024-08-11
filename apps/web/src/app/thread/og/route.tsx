import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const threadTitle = searchParams.get("title");
  const creatorAvatar = searchParams.get("creatorAvatar");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 30,
          padding: 16,
          justifyContent: "center",
          backgroundColor: "var(--color-primary-900)",
        }}
      >
        <img
          src={creatorAvatar!}
          alt={threadTitle!}
          width={40}
          height={40}
          style={{ borderRadius: "100%" }}
        />
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            display: "flex",
            fontSize: 52,
            letterSpacing: "-0.05em",
            fontStyle: "normal",
            color: "var(--color-primary-200)",
            lineHeight: "120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {threadTitle}
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
