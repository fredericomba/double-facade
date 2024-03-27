import assert from 'assert/strict';
import http from 'http';
import test from 'node:test';

test('DoubleFacade', async () => {

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

    });

});

