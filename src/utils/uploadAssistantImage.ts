const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export async function uploadAssistantImage(image: string) {
  // Upload to Cloudinary
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "qxkzlm62");

  console.log(image);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  console.log(response);

  if (response.ok) {
    const jsonResponse = await response.json();
    return jsonResponse.secure_url;
  } else {
    throw new Error("Upload failed");
  }
}
