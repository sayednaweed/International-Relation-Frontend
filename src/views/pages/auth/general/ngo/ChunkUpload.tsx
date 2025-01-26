import React, { useState } from "react";
import axios from "axios";

const ChunkUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Maximum chunk size in bytes (example: 5MB per chunk)
  const CHUNK_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFileInChunks = async () => {
    if (!file) return;

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let chunkIndex = 0;

    // Function to upload the current chunk
    const uploadChunk = async (chunk: Blob, index: number) => {
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("index", String(index));
      formData.append("totalChunks", String(totalChunks));

      try {
        await axios.post("/api/upload-chunk", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        });
      } catch (error) {
        console.error("Error uploading chunk", error);
      }
    };

    // Split file into chunks and upload them
    while (chunkIndex < totalChunks) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      await uploadChunk(chunk, chunkIndex);
      chunkIndex++;
    }

    alert("File uploaded successfully");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFileInChunks}>Upload in Chunks</button>
      <progress value={uploadProgress} max={100}></progress>
    </div>
  );
};

export default ChunkUpload;
