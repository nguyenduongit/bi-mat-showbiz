// src/PostPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import styles from "./App.module.css";

type Post = {
  title: string;
  description: string;
  image: string;
};

// Hàm helper để cập nhật meta tag
const updateMetaTags = (post: Post | null) => {
  if (post) {
    // Cập nhật tiêu đề trang
    document.title = post.title;

    // Cập nhật các thẻ meta
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", post.title);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", post.description);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", post.description);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute("content", post.image);
    document
      .querySelector('meta[property="twitter:title"]')
      ?.setAttribute("content", post.title);
    document
      .querySelector('meta[property="twitter:description"]')
      ?.setAttribute("content", post.description);
    document
      .querySelector('meta[property="twitter:image"]')
      ?.setAttribute("content", post.image);
  } else {
    // Reset về giá trị mặc định nếu cần
    const defaultTitle = "Bí Mật Showbiz";
    const defaultDesc = "Trang tin tức và quản lý bài viết.";
    const defaultImage = "/vite.svg"; // Ảnh mặc định

    document.title = defaultTitle;
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", defaultTitle);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", defaultDesc);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", defaultDesc);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute("content", defaultImage);
    document
      .querySelector('meta[property="twitter:title"]')
      ?.setAttribute("content", defaultTitle);
    document
      .querySelector('meta[property="twitter:description"]')
      ?.setAttribute("content", defaultDesc);
    document
      .querySelector('meta[property="twitter:image"]')
      ?.setAttribute("content", defaultImage);
  }
};

export function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getPostAndSetMeta() {
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
        updateMetaTags(null); // Cập nhật meta cho trang lỗi
      } else {
        setPost(data);
        updateMetaTags(data); // Cập nhật meta với dữ liệu bài viết
      }
      setLoading(false);
    }

    getPostAndSetMeta();

    // Hàm cleanup: Reset meta tags khi component bị hủy
    return () => {
      updateMetaTags(null);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Đang tải...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
