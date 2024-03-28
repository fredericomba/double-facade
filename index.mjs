import fs from 'fs/promises';
import path from 'path';

export const create = () => {

    const requestListener = (request, response) => {

        const folderStatic = path.join(process.cwd(), 'static');

        const promise = (async () => {

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
        requestListener,
    });

};

const DoubleFacade = Object.freeze({
    create,
});

export default DoubleFacade;

