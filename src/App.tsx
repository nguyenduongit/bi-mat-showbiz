// src/App.tsx
import { useState, useEffect } from "react";
import styles from "./App.module.css"; // Đổi tên file CSS
import slugify from "slugify";
import { supabase } from "./lib/supabaseClient"; // Cập nhật đường dẫn import

type Post = {
  id?: number;
  created_at?: string;
  title: string;
  description: string;
  image: string;
  slug: string;
};

const initialFormState: Omit<Post, "id" | "created_at"> = {
  title: "",
  description: "",
  image: "",
  slug: "",
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setPosts(data);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title" && !editingSlug) {
      const newSlug = slugify(value, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      setForm({ ...form, title: value, slug: newSlug });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let error;

    if (editingSlug) {
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: form.title,
          description: form.description,
          image: form.image,
        })
        .eq("slug", editingSlug);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("posts").insert([
        {
          ...form,
        },
      ]);
      error = insertError;
    }

    if (error) {
      console.error("Supabase error:", error);
      alert("Lỗi từ Supabase: " + error.message);
    } else {
      await fetchPosts();
      handleCancelEdit();
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      await supabase.from("posts").delete().eq("slug", slug);
      await fetchPosts();
    }
  };

  const handleEdit = (post: Post) => {
    setEditingSlug(post.slug);
    setForm({
      title: post.title,
      description: post.description,
      image: post.image,
      slug: post.slug,
    });
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
    setForm(initialFormState);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Trang Quản Lý Bài Viết</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="title"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          name="image"
          placeholder="Link ảnh"
          value={form.image}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            {editingSlug ? "Cập nhật bài viết" : "Tạo bài viết"}
          </button>
          {editingSlug && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className={styles.cancelButton}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <h2 className={styles.postListHeader}>Danh sách bài viết</h2>
      <ul className={styles.postList}>
        {posts.map((post) => (
          <li key={post.slug} className={styles.postItem}>
            <a
              href={`/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.postLink}
            >
              {post.title}
            </a>
            <div className={styles.actionButtons}>
              <button
                onClick={() => handleEdit(post)}
                className={styles.editButton}
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(post.slug)}
                className={styles.deleteButton}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
