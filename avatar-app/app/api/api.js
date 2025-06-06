const API_URL = 'http://127.0.0.1:8000';

/**
 * Saves a drawing to the server.
 * 
 * @param {Object} drawingData - The data of the drawing to save.
 * @param {string} drawingData.userId - The ID of the user.
 * @param {string} drawingData.imagePath - The path to the image file.
 * @returns {Promise<Response>} The response from the server.
 */

export const saveDrawing = async (drawingData) => {
  const payload = {
    user_id: drawingData.userId, // Match FastAPI model: user_id
    image_path: drawingData.imagePath, // Match FastAPI model: image_path
}};

  try {
    const response = await fetch(`${API_URL}/drawings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.text(); // Or response.json() if the error is JSON
    }}
  catch (error) {
    console.error('Error saving drawing:', error);
    throw error; // Re-throw the error for further handling
  };