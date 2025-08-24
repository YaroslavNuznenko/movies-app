const getRandomVideo = () => {
  const videos = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    'https://file-examples.com/storage/fe68c0eef0c636c75e7a093/2017/10/file_example_MP4_480_1_5MG.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  ];
  return videos[Math.floor(Math.random() * videos.length)];
};

export default getRandomVideo;
