import assert from 'assert/strict';
import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import test from 'node:test';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const FOLDER_SAMPLES = path.join(__dirname, 'samples');
const FOLDER_TEMPORARY = path.join(process.cwd(), 'temporary');

const REASON_MISMATCH
    = '[MISMATCH CONTENT: EXPECTED DATA DOES NOT MATCH REFERENCE DATA]';

const REASON_TIMEOUT
    = '[TIME-OUT: PROCESS IS TAKING TOO LONG TO COMPLETE]';

const URL_FICTITIOUS_DOCUMENT = '/non-existing-document.html';

const teardown = async () => {

    await fs.rm(FOLDER_TEMPORARY, {
        recursive: true,
        force: true,
    });

};

const setup = async () => {

    await teardown();

    await fs.mkdir(FOLDER_TEMPORARY);
    process.chdir(FOLDER_TEMPORARY);

    const optionsCopy = {
        force: true,
        recursive: true,
    };

    await fs.cp(FOLDER_SAMPLES, FOLDER_TEMPORARY, optionsCopy);

};

const folderStack = [];

const folderEnter = (folder) => {

    const folderSaved = process.cwd();
    folderStack.push(folderSaved);

    const folderPlace = path.join(folderSaved, folder);
    process.chdir(folderPlace);

};

const folderLeave = () => {

    const folderSaved = folderStack.pop();
    if (folderSaved) {

        process.chdir(folderSaved);

    }

};

await test('DoubleFacade', async () => {

    await setup();

    const { default: DoubleFacade } = await import('@double-facade');

    await test('should have a "create" function', async () => {

        assert(typeof DoubleFacade.create === 'function');

        const doubleFacade = DoubleFacade.create();

        await test('should be an object with properties', async () => {

            assert(typeof doubleFacade === 'object');
            assert(doubleFacade !== null);

        });

        await test('should have a "requestListener" for servers', async () => {

            const { requestListener } = doubleFacade;

            assert(typeof requestListener === 'function');

        });

        let sampleKey;

        sampleKey = '0001';
        folderEnter(sampleKey);

        await test('"static/index.html" is the default root document', async () => {

            const folderTarget = path.join(FOLDER_TEMPORARY, sampleKey);

            const pathRootDocument = path.join(folderTarget, 'static', 'index.html');
            const dataRootDocument = await fs.readFile(pathRootDocument);

            const promise = new Promise((resolve, reject) => {

                const TIMEOUT_FAILURE = 4000; // four seconds
                const TIMEOUT_SHUTDOWN = 4000; // four seconds

                const errorTimeout = new Error(REASON_TIMEOUT);
                setTimeout(reject, TIMEOUT_FAILURE, errorTimeout);

                const fetchRootDocument = (hostname, port, family) => {

                    const options = {
                        timeout: TIMEOUT_FAILURE,
                        hostname: hostname,
                        port: port,
                        family: family,
                        path: '/',
                        method: 'GET',
                    };

                    const request = http.request(options, (response) => {

                        const mismatch = () => {

                            const errorMismatch = new Error(REASON_MISMATCH);
                            reject(errorMismatch);

                            response.destroy();
                            request.destroy();

                        };

                        let indexA = 0;

                        response.on('error', (error) => {

                            reject(error);

                        });

                        response.on('data', (chunk) => {

                            const { length } = chunk;

                            const indexB = indexA + length | 0;

                            const comparison = chunk.compare(
                                dataRootDocument,
                                indexA,
                                indexB,
                            );

                            if (comparison !== 0) {

                                mismatch();
                                return;

                            }

                            indexA = indexB;

                        });

                        response.on('end', () => {

                            if (indexA === dataRootDocument.length) {

                                resolve();
                                return;

                            }

                            mismatch();

                        });

                    });

                    request.on('error', (error) => {

                        reject(error);

                    });

                    const shutdown = () => {

                        request.destroy();

                    };

                    setTimeout(shutdown, TIMEOUT_SHUTDOWN);

                    request.end();

                };

                const { requestListener } = doubleFacade;

                const server = http.createServer(requestListener);
                server.listen(0, () => {

                    const address = server.address();
                    const { address: hostname, port, family } = address;
                    setImmediate(fetchRootDocument, hostname, port, family);

                });

                const shutdown = () => {

                    server.close();

                };

                setTimeout(shutdown, TIMEOUT_SHUTDOWN);

            });

            await promise;

        });

        await test('should return the root document on cache miss', async () => {

            const folderTarget = path.join(FOLDER_TEMPORARY, sampleKey);

            const pathRootDocument = path.join(folderTarget, 'static', 'index.html');
            const dataRootDocument = await fs.readFile(pathRootDocument);

            const promise = new Promise((resolve, reject) => {

                const TIMEOUT_FAILURE = 4000; // four seconds
                const TIMEOUT_SHUTDOWN = 4000; // four seconds

                const errorTimeout = new Error(REASON_TIMEOUT);
                setTimeout(reject, TIMEOUT_FAILURE, errorTimeout);

                const fetchMissingDocument = (hostname, port, family) => {

                    const options = {
                        timeout: TIMEOUT_FAILURE,
                        hostname: hostname,
                        port: port,
                        family: family,
                        path: URL_FICTITIOUS_DOCUMENT,
                        method: 'GET',
                    };

                    const request = http.request(options, (response) => {

                        const mismatch = () => {

                            const errorMismatch = new Error(REASON_MISMATCH);
                            reject(errorMismatch);

                            response.destroy();
                            request.destroy();

                        };

                        let indexA = 0;

                        response.on('error', (error) => {

                            reject(error);

                        });

                        response.on('data', (chunk) => {

                            const { length } = chunk;

                            const indexB = indexA + length | 0;

                            const comparison = chunk.compare(
                                dataRootDocument,
                                indexA,
                                indexB,
                            );

                            if (comparison !== 0) {

                                mismatch();
                                return;

                            }

                            indexA = indexB;

                        });

                        response.on('end', () => {

                            if (indexA === dataRootDocument.length) {

                                resolve();
                                return;

                            }

                            mismatch();

                        });

                    });

                    request.on('error', (error) => {

                        reject(error);

                    });

                    const shutdown = () => {

                        request.destroy();

                    };

                    setTimeout(shutdown, TIMEOUT_SHUTDOWN);

                    request.end();

                };

                const { requestListener } = doubleFacade;

                const server = http.createServer(requestListener);
                server.listen(0, () => {

                    const address = server.address();
                    const { address: hostname, port, family } = address;
                    setImmediate(fetchMissingDocument, hostname, port, family);

                });

                const shutdown = () => {

                    server.close();

                };

                setTimeout(shutdown, TIMEOUT_SHUTDOWN);

            });

            await promise;

        });

        await test('should return the saved document on cache hit', async () => {

            const cachedDocumentPath = URL_FICTITIOUS_DOCUMENT;
            const cachedDocumentData = Buffer.from('Hello, World!', 'utf-8');
            const cachedDocumentHeaders = {
                'Content-Type': 'text/plain;charset=utf-8',
            };

            doubleFacade.cacheSave(
                cachedDocumentPath,
                cachedDocumentData,
                cachedDocumentHeaders,
            );

            const promise = new Promise((resolve, reject) => {

                const TIMEOUT_FAILURE = 4000; // four seconds
                const TIMEOUT_SHUTDOWN = 4000; // four seconds

                const errorTimeout = new Error(REASON_TIMEOUT);
                setTimeout(reject, TIMEOUT_FAILURE, errorTimeout);

                const fetchCachedDocument = (hostname, port, family) => {

                    const options = {
                        timeout: TIMEOUT_FAILURE,
                        hostname: hostname,
                        port: port,
                        family: family,
                        path: cachedDocumentPath,
                        method: 'GET',
                    };

                    const request = http.request(options, (response) => {

                        const mismatch = () => {

                            const errorMismatch = new Error(REASON_MISMATCH);
                            reject(errorMismatch);

                            response.destroy();
                            request.destroy();

                        };

                        let indexA = 0;

                        response.on('error', (error) => {

                            reject(error);

                        });

                        response.on('data', (chunk) => {

                            const { length } = chunk;

                            const indexB = indexA + length | 0;

                            const comparison = chunk.compare(
                                cachedDocumentData,
                                indexA,
                                indexB,
                            );

                            if (comparison !== 0) {

                                mismatch();
                                return;

                            }

                            indexA = indexB;

                        });

                        response.on('end', () => {

                            if (indexA === cachedDocumentData.length) {

                                resolve();
                                return;

                            }

                            mismatch();

                        });

                    });

                    request.on('error', (error) => {

                        reject(error);

                    });

                    const shutdown = () => {

                        request.destroy();

                    };

                    setTimeout(shutdown, TIMEOUT_SHUTDOWN);

                    request.end();

                };

                const { requestListener } = doubleFacade;

                const server = http.createServer(requestListener);
                server.listen(0, () => {

                    const address = server.address();
                    const { address: hostname, port, family } = address;
                    setImmediate(fetchCachedDocument, hostname, port, family);

                });

                const shutdown = () => {

                    server.close();

                };

                setTimeout(shutdown, TIMEOUT_SHUTDOWN);

            });

            await promise;

        });

        folderLeave();

    });

    await teardown();

});

