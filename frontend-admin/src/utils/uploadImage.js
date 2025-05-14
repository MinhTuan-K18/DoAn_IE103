// /utils/uploadImage.js
export async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "book_preset"); // 👈 preset của bạn
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dqkr3b1dq/image/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url; // 👈 link ảnh
  }
  