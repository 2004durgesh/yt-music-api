
export const asyncRoute = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    errorHandler(res, error);
  }
};

export const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
};

export const removeCircularReferences=()=> {
  const seen = new WeakSet();
  return function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined; // Remove circular reference
      }
      seen.add(value);
    }
    return value;
  };
}