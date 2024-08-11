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
          backgroundColor: "#09090b",
        }}
      >
        <img
          src={creatorAvatar!}
          alt={threadTitle!}
          width={96}
          height={96}
          style={{ borderRadius: "100%" }}
        />
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            display: "flex",
            fontSize: 120,
            letterSpacing: "-0.05em",
            fontStyle: "normal",
            color: "#e4e4e7",
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
