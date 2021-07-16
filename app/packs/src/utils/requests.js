const getAuthToken = () => document.querySelector('meta[name="csrf-token"]')?.content

const post = (url, content) => {
  const headers = { "Content-Type": "application/json" }

  if(getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken()
  }

  return fetch(url, {
    credentials: "include",
    method: "POST",
    headers,
    body: JSON.stringify(content)
  }).then((response) => {
    if (response.status == 200 || response.status == 201) {
      return response.json()
    } else {
      return Promise.resolve({ error: { status: response.status, value: response.error }})
    }
  })
}

const get = (url) =>{
  const headers = { "Content-Type": "application/json" }

  if(getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken()
  }

  return fetch(url, {
    credentials: "include",
    method: "GET",
    headers,
  }).then((response) => {
    if (response.status == 200 || response.status == 201) {
      return response.json()
    } else {
      return Promise.resolve({ error: { status: response.status, value: response.error }})
    }
  })
}

export { post, get }