import { fetcher, HttpMethod } from './fetcher';

export async function linkNodeApp(){
	return await fetcher({ url: 'auth/node-app', method: HttpMethod.Post });
}