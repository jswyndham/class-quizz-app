import NodeCache from 'node-cache';

const myCache = new NodeCache();

export const setCache = (key, data, ttl) => {
	myCache.set(key, data, ttl);
};

export const getCache = (key) => {
	return myCache.get(key);
};
