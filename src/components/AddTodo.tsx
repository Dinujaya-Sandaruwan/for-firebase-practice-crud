import React, { useState } from 'react';
import { db, storage } from '../config/firebase';
import {
    addDoc,
    collection,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Todos {
    title: string;
    completed: boolean;
    imageUrl: string[];
    createdAt: any; // Adjust the type based on your timestamp format
}

interface AddTodoProps {
    onTodoAdded: (todoData: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);

    const todoCollectionRef = collection(db, 'todos');

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files);
        }
    };

    const handleAddTodo = async () => {
        try {
            if (title.trim() !== '') {
                const docRef = await addDoc(todoCollectionRef, {
                    title: title.trim(),
                    completed: false,
                    imageUrl: [], // Initialize imageUrl as an empty array
                    createdAt: serverTimestamp(), // Add server timestamp
                });

                if (image) {
                    setUploading(true);

                    const imageUrlArray: string[] = [];

                    // Upload each file separately
                    for (let i = 0; i < image.length; i++) {
                        const file = image[i];
                        const imageRef = ref(
                            storage,
                            `images/${docRef.id}/${file.name}`,
                        );
                        await uploadBytes(imageRef, file);
                        const downloadUrl = await getDownloadURL(imageRef);

                        imageUrlArray.push(downloadUrl); // Push the download URL to the array
                    }

                    // Save the imageUrl array in the todo document
                    await setDoc(docRef, {
                        title: title.trim(),
                        imageUrl: imageUrlArray,
                        completed: false,
                        createdAt: serverTimestamp(), // Update the createdAt timestamp
                    });

                    setUploading(false);
                }

                setTitle('');
                setImage(null);
                onTodoAdded(title.trim());
            }
        } catch (error) {
            console.log('Error adding todo:', error);
        }
    };

    return (
        <div>
            <input type="text" value={title} onChange={handleTitleChange} />
            <input type="file" multiple onChange={handleImageChange} />
            {uploading && <p>Uploading images...</p>}
            <button onClick={handleAddTodo}>Add Todo</button>
        </div>
    );
};

export default AddTodo;
