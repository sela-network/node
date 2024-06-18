import { deepmerge } from 'deepmerge-ts';
import { SERVER_URL } from '../constants';

export enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Patch = 'PATCH',
	Put = 'PUT',
	Delete = 'DELETE',
}

export class ApiError extends Error {
	readonly statusCode: number;
	readonly statusText: string;
	readonly context?: Record<string, any>;

	constructor(
		msg: string,
		{
			statusCode,
			statusText,
			context,
		}: {
			statusCode: number;
			statusText: string;
			context?: Record<string, any>;
		},
	) {
		super(msg);
		Object.setPrototypeOf(this, ApiError.prototype);
		this.statusCode = statusCode;
		this.statusText = statusText;
		this.context = context;
	}
}

export async function fetcher<T>({
	url,
	method,
	version = 1,
	data,
	...rest
}: {
	url: string;
	method: HttpMethod;
	version?: number;
	data?: Record<string, any> | any[] | string | number;
} & Omit<RequestInit, 'method' | 'body'>): Promise<T> {
	if (!Object.values(HttpMethod).includes(method)) {
		throw new Error(`invalid HTTP method ${method}`);
	}

	const token = await (window as any).methods.getToken();

	const request = deepmerge(rest, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: data ? JSON.stringify(data) : undefined,
	});

	const path = new URL(
		`api/v${version}/${url}`,
		SERVER_URL,
	);

	const response = await fetch(path, request);
	const body =
		response.status === 204
			? {}
			: ((await response.json()) as Record<string, any>);

	if (!response.ok) {
		throw new ApiError(
			(body
				? Reflect.get(body, 'message')
				: 'An API Error Occurred') as string,
			{
				statusCode: response.status,
				statusText: response.statusText,
				context: { path },
			},
		);
	}

	return body as T;
}
