import React, {Dispatch, forwardRef, useImperativeHandle, useRef, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInfiniteScroll, IonInfiniteScrollContent,
    IonList,
    IonModal,
    IonSearchbar,
    IonToolbar,
} from "@ionic/react";
import {BookItem} from "./BookItem";

interface SelectBookModalProps {
    setBook: Dispatch<any>
}

export type ModalHandle = {
    open: () => void;
};

const SelectBookModal = forwardRef<ModalHandle, SelectBookModalProps>(({setBook}: SelectBookModalProps ,ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
    const [query, setQuery] = useState<string>("");
    const selectBookModal = useRef<HTMLIonModalElement>(null);

    useImperativeHandle(ref, () => ({
        open() {
            setIsOpen(true);
        },
    }));

    // calls HTTP API of OpenLibrary to search books by the given query and offset
    async function searchBooks(q: string, offset: number) {
        if (q === "") {
            return [];
        }
        const api = "https://openlibrary.org/search.json";
        const result = await fetch(`${api}?q=${q}&fields=title,author_name,cover_i&limit=20&offset=${offset}`);
        const json = await result.json();
        return json.docs.map(cleanBookData);
    }

    // handle missing book cover and author
    function cleanBookData(doc: any) {
        if (doc.cover_i === undefined) {
            doc.image = "assets/images/default_book_cover.jpg";
        } else {
            doc.image = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
        }
        if (doc.author_name === undefined) {
            doc.author = "Unknown author";
        } else {
            doc.author = doc.author_name[0];
        }
        return doc;
    }

    // called when user scrolls all the way down
    async function scroll(event: any) {
        try {
            let newBooks = await searchBooks(query, books.length);
            setBooks([...books, ...newBooks]);
            // needed to make the infinite scroll work
            event.target.complete();
        } catch (error) {
            // catch errors for both fetch and result.json()
            console.log(error);
        }
    }

    // called when user types in the search bar
    async function search(event: any) {
        let newQuery = event.target.value;
        setQuery(newQuery);
        try {
            let books = await searchBooks(newQuery, 0);
            setBooks(books);
        } catch (error) {
            // catch errors for both fetch and result.json()
            console.log(error);
        }
    }

    function cancelModal() {
        setIsOpen(false);
        setBooks([]);
        setSelectedBookIndex(0);
    }

    function confirmModal() {
        let book = books[selectedBookIndex];
        setBook({
            title: book.title,
            author: book.author,
            authors: book.author_name,
            image: book.image,
        });
        setIsOpen(false);
    }

    return (
        <IonModal ref={selectBookModal} isOpen={isOpen} onDidDismiss={cancelModal} initialBreakpoint={0.20} breakpoints={[0.20, 1]}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={confirmModal}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar onClick={() => selectBookModal.current?.setCurrentBreakpoint(1)} class="custom ion-no-padding" placeholder="Find a book" debounce={1000} onIonInput={search}></IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-no-padding">
                <IonList>
                    {books.map((book, index) => {
                        return (
                            <div key={index} onClick={() => setSelectedBookIndex(index)}>
                                <BookItem
                                    image={book.image}
                                    title={book.title}
                                    author={book.author}
                                    selected={selectedBookIndex === index}
                                />
                            </div>
                        );
                    })}
                </IonList>
                <IonInfiniteScroll onIonInfinite={scroll}>
                    <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonModal>
    );
});

export default SelectBookModal;
