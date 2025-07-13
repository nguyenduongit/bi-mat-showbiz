// src/PostPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // 1. Import Helmet
import { supabase } from "./lib/supabaseClient";
import styles from "./App.module.css";

type Post = {
  title: string;
  description: string;
  image: string;
};

export function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getPost() {
      if (!slug) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("title, description, image")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        setError("404 - Không tìm thấy bài viết bạn yêu cầu.");
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    getPost();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        {/* 2. Thêm Helmet cho trạng thái đang tải */}
        <Helmet>
          <title>Đang tải bài viết...</title>
        </Helmet>
        <h1>Đang tải...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        {/* 3. Thêm Helmet cho trang lỗi */}
        <Helmet>
          <title>Không tìm thấy bài viết</title>
          <meta property="og:title" content="Không tìm thấy bài viết" />
        </Helmet>
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 4. Đây là phần quan trọng nhất: dùng Helmet để chèn meta tags */}
      {post && (
        <Helmet>
          <title>{post.title}</title>
          <meta name="description" content={post.description} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.description} />
          <meta property="og:image" content={post.image} />
          {/* Bạn có thể thêm og:url ở đây nếu muốn */}
          {/* <meta property="og:url" content={window.location.href} /> */}

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={post.description} />
          <meta name="twitter:image" content={post.image} />
        </Helmet>
      )}

      {post && (
        <article>
          <h1 className={styles.header}>{post.title}</h1>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            />
          )}
          <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
            {post.description}
          </p>
        </article>
      )}
    </div>
  );
}
