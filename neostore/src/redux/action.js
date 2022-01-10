export const addToCart = () => {
    return {
        type: "INC"
    }
}
export const removeFromCart = () => {
    return {
        type: "DEC"
    }
}
export const setCart = (count = 0) => {
    return {
        type: "SET",
        payload: count
    }
}