import { htmlTemplate } from './template'

export interface Env {
	TITLE: string
	BASEURL: string
}

export default {
	async fetch(request: Request, env: Env) {

		async function gatherResponse(response) {
			const { headers } = response
			const contentType = headers.get('content-type') || ''
			if (contentType.includes('application/json')) {
				return JSON.stringify(await response.json())
			} else if (contentType.includes('application/text')) {
				return response.text()
			} else if (contentType.includes('text/html')) {
				return response.text()
			} else {
				return response.text()
			}
		}

		function rawHtmlResponse(html) {
			return new Response(html, {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			})
		}

		function setCorsHeaders(response: Response, origin: string) {
			response = new Response(response.body, response);
			response.headers.set('Access-Control-Allow-Origin', origin);
			response.headers.append('Vary', 'Origin');
			return response;
		}

		async function fetchWithOriginHeader(url: string) {
			const request = new Request(url);
			request.headers.set('Origin', new URL(url).origin);
			return await fetch(url);
		}

		// https://developers.cloudflare.com/workers/examples/cors-header-proxy/
		async function handleRequest(reqUrl: string) {
			const url = new URL(reqUrl);
			let response: Response;

			try {
					url.protocol = 'https:';
					response = await fetchWithOriginHeader(url.href);
			} catch (e) {
					if (e instanceof TypeError) {
							url.protocol = 'http:';
							response = await fetchWithOriginHeader(url.href);
					} else {
							throw e;
					}
			}

			// 设置跨域请求相关的响应头
			response = setCorsHeaders(response, url.origin);

			return response;
		}

		// 流程开始

		// 只允许 GET 请求
		if (request.method !== 'GET') {
			return new Response('Method Not Allowed', { status: 405 })
		}

		// 判断域名网址跳转
		const url = new URL(request.url)
		if (env.BASEURL !== '' && env.BASEURL !== url.origin) {
			return Response.redirect(env.BASEURL, 302)
		}

		// 设置网页标题
		if (url.pathname === '' || url.pathname === '/') {
			const title = env.TITLE
			const html = htmlTemplate.replace(/{{ title }}/g, title)
			return rawHtmlResponse(html)
		}

		// 网站图标
		if (url.pathname === '/favicon.ico') {
			return new Response(null, { status: 204 })
		}

		// 取出网址
		let redirectUrl = url.pathname.slice(1)
		// 解码 encodedFileUrl
		redirectUrl = decodeURIComponent(redirectUrl);

		const httpReg = /^http?:\/\//
		const httpsReg = /^https?:\/\//

		// https://xx.com/https://xx.com/x.zip
		if (redirectUrl.match(httpReg) || redirectUrl.match(httpsReg)) {
			return handleRequest(redirectUrl)
		}

		redirectUrl = redirectUrl.replace(/^\/+/g, 'https://')
		// https://xx.com////https://xx.com/x.zip
		if (redirectUrl.match(httpReg) || redirectUrl.match(httpsReg)) {
			return handleRequest(redirectUrl)
		}

		redirectUrl = url.href
		// https://xx.com/////xx.com/x.zip
		if (redirectUrl.match(httpReg) || redirectUrl.match(httpsReg)) {
			return handleRequest(redirectUrl)
		}

		return new Response(`request url: ${request.url}`)
	},
}
