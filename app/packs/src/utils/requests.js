const getAuthToken = () =>
  document.querySelector('meta[name="csrf-token"]')?.content;

const post = (url, content) => {
  const headers = { "Content-Type": "application/json" };

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }

  const body = content instanceof FormData ? content : JSON.stringify(content);

  return fetch(url, {
    credentials: "include",
    method: "POST",
    headers,
    body,
  }).then((response) => {
    return response.json();
  });
};

const put = (url, content) => {
  const headers = { "Content-Type": "application/json" };

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }

  const body = content instanceof FormData ? content : JSON.stringify(content);

  return fetch(url, {
    credentials: "include",
    method: "PUT",
    headers,
    body,
  }).then((response) => {
    return response.json();
  });
};

const patch = (url, content) => {
  const headers = { "Content-Type": "application/json" };

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }

  const body = content instanceof FormData ? content : JSON.stringify(content);

  return fetch(url, {
    credentials: "include",
    method: "PATCH",
    headers,
    body,
  }).then((response) => {
    return response.json();
  });
};

const get = (url) => {
  const headers = { "Content-Type": "application/json" };

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }

  return fetch(url, {
    credentials: "include",
    method: "GET",
    headers,
  }).then((response) => {
    return response.json();
  });
};

const externalGet = (url, params = {}) => {
  return fetch(url).then((response) => {
    if (params.ignoreJSON) {
      return response;
    }
    return response.json();
  });
};

const destroy = (url, content) => {
  const headers = { "Content-Type": "application/json" };

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }

  const body = content instanceof FormData ? content : JSON.stringify(content);

  return fetch(url, {
    credentials: "include",
    method: "DELETE",
    headers,
    body,
  }).then((response) => {
    if (response) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response;
      }
    }
  });
};

export { post, put, get, destroy, patch, getAuthToken, externalGet };
