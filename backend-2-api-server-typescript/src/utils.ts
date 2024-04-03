const extractKey = (link: string) => {
    const regex = /\/\/(.*?)\./;
    const match = link.match(regex);
    if (match && match.length > 1) {

        return match[1];
    } else {
        return null;
    }
}
module.exports = extractKey;