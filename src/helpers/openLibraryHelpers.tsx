
function getAuthorsArrayToString(authors: string[], limit?: number) {
    let string = "";
    let authorsSet = new Set(authors.map(author => author.toLowerCase()));
    let authorsArray = Array.from(authorsSet);
    if(limit){
        authorsArray.forEach((author, index) => {
            author = toUpperCaseFirstLettersOfAllWords(author);
            if (limit < index) {
                string += "";
            } else if (limit === index) {
                string += ", ...";
            } else if (limit === index) {
                string += author;
            } else if (authorsArray.length > 1 && limit - 1 !== index) {
                string += author + ", ";
            } else {
                string += author;
            }
        });
    }else{
        authorsArray.forEach((author) => {
            author = toUpperCaseFirstLettersOfAllWords(author);
            if (authorsArray.length > 1) {
                string += author + ", ";
            } else {
                string += author;
            }
        })
    }
    return string;
}

function toUpperCaseFirstLettersOfAllWords(string: string) {
    if(!string || /^\s*$/.test(string)) {
        return "";
    }else{
        return string
            .replace(/ +(?= )/g,'')
            .toLowerCase()
            .split(' ')
            .map(function (word) {
                if(word[0] != undefined) {
                    return word[0].toUpperCase() + word.slice(1);
                } else {
                    return word;
                }
            })
            .join(' ');
    }
}

export {
    toUpperCaseFirstLettersOfAllWords,
    getAuthorsArrayToString,
};