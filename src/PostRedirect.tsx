// src/PostRedirect.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

export function PostRedirect() {
  const { slug } = useParams();
  const [status, setStatus] = useState("Đang tìm link...");

  useEffect(() => {
    async function getPostAndRedirect() {
      if (!slug) return;

      const { data: post } = await supabase
        .from("posts")
        .select("externalUrl")
        .eq("slug", slug)
        .single();

      if (post?.externalUrl) {
        window.location.href = post.externalUrl;
      } else {
        setStatus(
          "404 - Không tìm thấy bài viết hoặc không có link chuyển hướng."
        );
      }
    }

    getPostAndRedirect();
  }, [slug]);

  return <h1>{status}</h1>;
}
