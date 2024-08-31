interface BibleVerse {
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
}

export interface BibleVerseApiResponse {
/*
{
    "reference": "Numbers 10:24",
    "verses": [
    {
        "book_id": "NUM",
        "book_name": "Numbers",
        "chapter": 10,
        "verse": 24,
        "text": "Abidan the son of Gideoni was over the army of the tribe of the children of Benjamin.\n"
    }
    ],
    "text": "Abidan the son of Gideoni was over the army of the tribe of the children of Benjamin.\n",
    "translation_id": "web",
    "translation_name": "World English Bible",
    "translation_note": "Public Domain"
}
*/
    reference: string
    verses: Array<BibleVerse>
    text: string
    translation_id: string
    translation_name: string
    translation_note: string
}