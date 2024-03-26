import assert from 'assert/strict';
import test from 'node:test';

test('DoubleFacade', async () => {

    const { default: DoubleFacade } = await import('@double-facade');

    await test('should have a "create" function', async () => {

        assert(typeof DoubleFacade.create === 'function');

    });

});

