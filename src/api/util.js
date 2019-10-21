/**
 * @function fetchToJson
 * @description Takes the parameters for a fetch request and converts the response to json
 * @param {string} url URL for the fetch request
 * @param {JSON} op  Options for the fetch request
 *
 * @return {Promise} Resolves with JSON when response.status === 200
 *                   Rejects response object otherwise
 */
export default async (url, op) => {
  const response = await fetch(url, op);
  const status = response.status;
  if (status != 200 && status != 201) {
    throw new Error(response.status);
  }
  const json = await response.json();
  return json;
};
