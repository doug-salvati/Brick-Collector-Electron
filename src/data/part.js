const createPart = (
    id,
    title,
    color,
    img,
    quantity,
    loose,
) => ({
    id,
    title,
    color,
    img,
    quantity,
    loose,
});

const mapPart = (apiResponse, quantity, loose) => {
    return createPart(
        apiResponse.element_id,
        apiResponse.part.name,
        apiResponse.color.name,
        apiResponse.element_img_url,
        quantity,
        loose,
    );
};

export default {
    createPart,
    mapPart,
};