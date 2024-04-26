// import readline from "node:readline";
// there is an issue within this code on the blank space. Letters can be encrypted as a black space in some cases
// and when decrypted, they still remain as blank space, e.g. when key = 7, text = t. I do not know how to fix it


// encrypt
function caesarEncrypt(text, key) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' '];
    const plainCharArray = alphabet.join('').toLowerCase();
    key = key % plainCharArray.length;
    //console.log(plainCharArray);
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let letter = text[i];
        if (letter === ' '){
            result += ' ';
            continue;
        }
        let position = (plainCharArray.indexOf(letter) + key) % plainCharArray.length;
        result += plainCharArray[position];
    }
    return result
}

//decrypt
function caesarDecrypt(encryptedText, key) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' '];
    const plainCharArray = alphabet.join('').toLowerCase();
    key = key % plainCharArray.length;
    //console.log(plainCharArray);
    let result = '';
    for (let i = 0; i < encryptedText.length; i++) {
        let letter = encryptedText[i];
        if (letter === ' '){
            result += ' ';
            continue;
        }
        let position = (plainCharArray.indexOf(letter) - key) % plainCharArray.length;
            if (position < 0) {
                position += plainCharArray.length;
            }
        result += plainCharArray[position];
    }
    return result;
}


let text = 'hello world';
let key =  7;
let encryptedText = caesarEncrypt(text,key);
let decryptedText = caesarDecrypt(encryptedText, key);

console.log(`Original: ${text}`);
console.log(`Encrypted: ${encryptedText}`);
console.log(`Decrypted: ${decryptedText}`)







// const alphabet = "abcdefghijklmnopqrstuvwxyz";
// const alphabetArray = alphabet.split('');
// console.log(alphabetArray);


// // Create interface for reading input from terminal
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
//
// // Ask for input from the user
// rl.question('Enter text to encrypt: ', (text) => {
//     // Ask for encryption key
//     rl.question('Enter encryption key: ', (key) => {
//         // Encrypt the input text with the specified key
//         const encryptedText = caesarEncrypt(text.toLowerCase(), parseInt(key));
//         console.log('Encrypted text:', encryptedText);
//
//         // Ask if the user wants to decrypt the text
//         rl.question('Decrypt? (yes/no): ', (answer) => {
//             if (answer.toLowerCase() === 'yes' || 'y') {
//                 // Decrypt the encrypted text
//                 const decryptedText = caesarDecrypt(encryptedText, parseInt(key));
//                 console.log('Decrypted text:', decryptedText);
//             }
//             rl.close();
//         });
//     });
// });
