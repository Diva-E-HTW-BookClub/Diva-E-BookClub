import React, {forwardRef, useImperativeHandle, useState} from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
    IonButton,
    IonButtons, IonChip,
    IonContent,
    IonHeader,
    IonInfiniteScroll, IonInfiniteScrollContent,
    IonInput,
    IonItem,
    IonLabel, IonList,
    IonModal,
    IonNote, IonSearchbar,
    IonTitle,
    IonToolbar, useIonPicker,
} from "@ionic/react";
import {createBookClubDocument} from "../firebase/firebaseBookClub";
import {BookCard} from "./BookCard";
import {useHistory} from "react-router-dom";

type FormValues = {
    name: string;
    maxMemberNumber: number;
};

export type ModalHandle = {
    open: () => void;
};

const CreateClubModal = forwardRef<ModalHandle>((props,ref) => {
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [maxMember, setMaxMember] = useState<number>(1);
    const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
    const [query, setQuery] = useState<string>("");
    const user = useSelector((state: any) => state.user.user);

    useImperativeHandle(ref, () => ({
        open() {
            setIsOpen(true);
        },
    }));

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            maxMemberNumber: 1,
        },
        mode: "all",
    });

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

    const [presentPicker] = useIonPicker();

    const pickerOptions = () => {
        let options = [];
        for (let i = 1; i <= 50; i++) {
            let textLabel = i.toString();
            options.push({ text: textLabel, value: i });
        }
        return options;
    };

    const openPicker = async () => {
        await presentPicker({
            columns: [
                {
                    name: "maxMember",
                    options: pickerOptions(),
                },
            ],
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                },
                {
                    text: "Confirm",
                    handler: (value) => {
                            setValue("maxMemberNumber", value.maxMember.value);
                            setMaxMember(value.maxMember.value);
                    },
                },
            ],
        });
    };

    function cancelModal() {
        reset({
            name: "",
            maxMemberNumber: 1,
        });
        setMaxMember(1);
        setIsOpen(false);
        setBooks([]);
        setSelectedBookIndex(0);
    }

    async function submitData(data: any) {
        let book = books[selectedBookIndex];
        let userId = user.uid;
        await createBookClubDocument({
            id: "",
            name: data.name,
            moderator: [userId],
            members: [userId],
            maxMemberNumber: data.maxMemberNumber,
            book: {
                title: book.title,
                authors: book.author_name,
                imageUrl: book.image
            },
            discussions: [],
            resources: [],
            owner: userId,
            keywords: []
        }).then((bookClubId) => {
            cancelModal()
            setTimeout(() => history.push(`/clubs/${bookClubId}/view`), 200);
        });
    }

    return (
            <IonModal isOpen={isOpen} onDidDismiss={cancelModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={cancelModal}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Create Club</IonTitle>
                        <IonButtons slot="end">
                            <IonButton type="submit" form="createClub">
                                Create
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-no-padding">
                    <form id="createClub" className="ion-padding" onSubmit={handleSubmit(submitData)}>
                        <IonItem className={errors.name ? "ion-invalid" : "ion-valid"}>
                            <IonLabel position="stacked">Club Name</IonLabel>
                            <IonInput
                                placeholder="Enter a Name"
                                {...register("name", { required: "Club Name is required" })}
                            />
                            <IonNote slot="helper">Name by which others can find your Club</IonNote>
                            {errors.name && (
                                <IonNote slot="error" color={"danger"}>
                                    {errors.name.message}
                                </IonNote>
                            )}
                        </IonItem>
                        <IonItem className={errors.maxMemberNumber ? "ion-invalid" : "ion-valid"}>
                            <IonLabel>Max number of members</IonLabel>
                            <IonChip
                                onClick={() => openPicker()}
                                {...register("maxMemberNumber")}
                            >
                                {maxMember}
                            </IonChip>
                            <IonNote slot="helper">
                                Amount of people that can join your Club<br/>(including yourself)
                            </IonNote>
                        </IonItem>
                    </form>
                    <IonSearchbar class="custom" placeholder="Find a book" debounce={1000} onIonInput={search}></IonSearchbar>
                    <IonList lines="none">
                        {books.map((book, index) => {
                            return (
                                <div onClick={() => setSelectedBookIndex(index)}>
                                    <BookCard
                                        key={index}
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

export default CreateClubModal;
