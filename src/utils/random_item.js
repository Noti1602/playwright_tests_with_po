/**
 * @param {number} num1
 * @param {number} num2
 */

 export function pickRandomItems(num1, num2) {
    const randomNumbers = new Set();
    while (randomNumbers.size < Math.min(num1, num2)) {
        randomNumbers.add(Math.floor(Math.random() * num2));
    }
    return Array.from(randomNumbers);
}