import data from './data.json';

export const mockData = data;

export const fetchAppData = () => {
  return new Promise((resolve) => {
    // Simulating API delay
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};
