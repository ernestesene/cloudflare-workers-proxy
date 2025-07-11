// src/index.js
var src_default = {
  async fetch(request, env) {
    return await handleRequest(request).catch(
      (err) => new Response(err.stack, { status: 500 })
    );
  }
};
async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  let prox_mode = null;
  if (pathname.startsWith("/proxs/")) {
    prox_mode = "https://";
  } else if (pathname.startsWith("/proxh/")) {
    prox_mode = "http://";
  }
  if (prox_mode != null) {
    const headersOrg = request.headers;
    const method = headersOrg.get("mymethod");
    const path = headersOrg.get("mypath");
    if (null === path) {
      const endpoint = prox_mode + pathname.slice(7) + url.search;
      if (method === null || method == "GET")
        return fetch(endpoint, request);
      else
        return fetch(endpoint, new Request(request, { method }));
    } else {
      const endpoint = prox_mode + path;
      const headers = new Headers(headersOrg);
      headers.delete("mypath");
      if (method === null || method == "GET")
        return fetch(endpoint, new Request(request, { headers }));
      else
        return fetch(endpoint, new Request(request, { method, headers }));
    }
  }
  if (pathname.startsWith("/api")) {
    return new Response(JSON.stringify({ pathname }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/url")) {
    return new Response(JSON.stringify(request), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/status")) {
    const httpStatusCode = Number(pathname.split("/")[2]);
    return Number.isInteger(httpStatusCode) ? fetch("https://http.cat/" + httpStatusCode) : new Response("That's not a valid HTTP status code.");
  }
  return new Response("Bad request. Try the client software");
}
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
