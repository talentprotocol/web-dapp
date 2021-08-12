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

const destroy = (url) => {
  const headers = { "Content-Type": "application/json" };

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }

  return fetch(url, {
    credentials: "include",
    method: "DELETE",
    headers,
  }).then((response) => {
    return response.json();
  });
};

export { post, get, destroy, patch, getAuthToken };
