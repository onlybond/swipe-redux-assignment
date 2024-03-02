const generateId = () => {
  return Math.floor(Math.random() * 1000).toFixed(0);
};

export default generateId;