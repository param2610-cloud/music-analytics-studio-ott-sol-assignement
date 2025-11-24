import Papa from 'papaparse';

const csvCache = new Map();

export const loadCSV = (filePath) => {
  if (csvCache.has(filePath)) {
    return csvCache.get(filePath);
  }

  const promise = new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });

  promise.catch(() => csvCache.delete(filePath));
  csvCache.set(filePath, promise);

  return promise;
};