const getRandomImage = () => {
  const images = [
    'https://picsum.photos/id/1/300/200',
    'https://picsum.photos/id/2/300/200',
    'https://picsum.photos/id/3/300/200',
    'https://picsum.photos/id/4/300/200',
    'https://picsum.photos/id/5/300/200',
    'https://picsum.photos/id/6/300/200',
    'https://picsum.photos/id/7/300/200',
    'https://picsum.photos/id/8/300/200',
    'https://picsum.photos/id/9/300/200',
    'https://picsum.photos/id/10/300/200',
  ];
  return images[Math.floor(Math.random() * images.length)];
};

export default getRandomImage;
