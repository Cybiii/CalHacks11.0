const axios = require('axios');

const serpapiApiKey = '7ecbc898f72aac24a3cf7d84444694019e7e485f7fc6631d5daafa41eac81b47'; // Replace with your actual API key

async function searchImages(query) {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        api_key: serpapiApiKey,
        engine: 'google_images',
        q: query,
        num: 10, // Number of results to retrieve
        tbm: 'isch', // Image search
      },
    });

    // Process the response data
    const images = response.data.images_results;

    // Access image data from the images array
    for (const image of images) {
      console.log(image.original); // Original image URL
      console.log(image.source); // Source of the image
      console.log(image.thumbnail); // Thumbnail image URL
      // ... other image properties
    }

  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
