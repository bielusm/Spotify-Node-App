/**
 * @function fetchToJson
 * @description Takes the parameters for a fetch request and converts the response to json
 * @param {string} url URL for the fetch request
 * @param {JSON} op  Options for the fetch request
 *
 * @return {Promise} Resolves with JSON when response.status === 200
 *                   Rejects response object otherwise
 */
export const fetchToJson = async (url, op) => {
  const response = await fetchErr(url, op);
  const json = await response.json();
  return json;
};

/**
 * Performs a fetch request and throws error if status is not 200 or 201
 */
export const fetchErr = async (url, op) => {
  const response = await fetch(url, op);
  const status = response.status;
  if (status != 200 && status != 201) {
    throw new Error(response.status);
  }
  return response;
};
