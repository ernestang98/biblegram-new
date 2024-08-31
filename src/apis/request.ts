import axios from "axios";

export const bibleVerseService = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Accept: 'application/json'
    },
    responseType: 'json',
    baseURL: "https://bible-api.com"
})

export function giveMeBibleVerse() {
    return bibleVerseService.get("/?random=verse")
}
