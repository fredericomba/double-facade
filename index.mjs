export const create = () => {

    const requestListener = (request, response) => {};

    return Object.freeze({
        requestListener,
    });

};

const DoubleFacade = Object.freeze({
    create,
});

export default DoubleFacade;

