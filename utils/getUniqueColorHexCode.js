

/**
 * Checks if a color is black or a grey shade.
 */
function isGreyOrBlack(color) {
    const hex = color.substring(1); // Remove #
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Black color
    if (r === 0 && g === 0 && b === 0) return true;
    
    // Grey color: R, G, B values are nearly equal
    return Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10;
}
/**
 * Generates a random, distinguishable color except grey and black.
 */
function generateRandomColor() {
    let color;
    do {
        color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    } while (isGreyOrBlack(color));
    return color;
}
export default  generateRandomColor