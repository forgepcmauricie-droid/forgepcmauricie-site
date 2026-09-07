export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve the real home page at / and support clean URLs such as
    // /services and /rdv-service-domicile in addition to .html files.
    if (url.pathname === "/") {
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url, request));
    }

    // Leave real files (images, CSS, JS, HTML, XML, etc.) untouched.
    const last = url.pathname.split("/").pop() || "";
    if (!last.includes(".")) {
      const htmlUrl = new URL(url);
      htmlUrl.pathname = `${url.pathname.replace(/\/$/, "")}.html`;
      const response = await env.ASSETS.fetch(new Request(htmlUrl, request));
      if (response.status !== 404) return response;
    }

    return env.ASSETS.fetch(request);
  }
};
