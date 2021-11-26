import axios from 'axios';

export async function getImages(name, page, per_page) {
  const searchParams = {
    params: {
      key: '24494931-7dc5820272f9876b2770bf0f4',
      q: `${name}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page,
    },
  };

  const response = await axios.get('https://pixabay.com/api/', searchParams);
  return response.data;
}