import fs from 'fs/promises';
import path from 'path';

export const create = () => {

    const EXTENSION_CACHE_DATA = '.cache.data';
    const EXTENSION_CACHE_JSON = '.cache.json';

    const cache = new Map();

    const cacheSave = (path, data, headers) => {

        const record = Object.freeze({ data, headers });
        cache.set(path, record);

    };

    const requestListener = (request, response) => {

        const folderStatic = path.join(process.cwd(), 'static');
        const folderCache = path.join(process.cwd(), 'cache');

        const promise = (async () => {

            const { url } = request;

            const cacheData = cache.get(url);
            if (cacheData) {

                const { data, headers } = cacheData;
                for (const [key, value] of Object.entries(headers)) {

                    response.setHeader(key, value);

                }

                response.write(data);

                return;

            }

            response.setHeader('Content-Type', 'text/html');

            const pathRootDocument = path.join(folderStatic, 'index.html');
            const dataRootDocument = await fs.readFile(pathRootDocument);
            response.write(dataRootDocument);

        })();

        promise.finally(() => {

            response.end();

        });

    };

    return Object.freeze({
        cacheSave,
        requestListener,
    });

};

const DoubleFacade = Object.freeze({
    create,
});

export default DoubleFacade;

