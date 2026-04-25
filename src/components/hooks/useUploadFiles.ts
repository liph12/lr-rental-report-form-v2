import axios from "axios";

export default async function useUploadFiles(files: File[]): Promise<string[]> {
  if (!files.length) return [];

  const formData = new FormData();
  const authToken = localStorage.getItem("authToken");

  files.forEach((file) => {
    formData.append("files[]", file);
  });

  try {
    const res = await axios.post(
      "https://api.leuteriorealty.com/lr/v2/public/api/upload-files",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    return res.data || [];
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
