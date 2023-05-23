import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface UpdateTodoProps {
    todoId: string;
    onUpdateTodo: () => void;
}

const UpdateTodo: React.FC<UpdateTodoProps> = ({ todoId, onUpdateTodo }) => {
    const [newTitle, setNewTitle] = useState('');

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.target.value);
    };

    const handleUpdateTodo = async () => {
        try {
            if (newTitle.trim() !== '') {
                const todoRef = doc(db, 'todos', todoId);

                await updateDoc(todoRef, {
                    title: newTitle.trim(),
                });

                setNewTitle('');
                onUpdateTodo(); // Notify parent component that the todo has been updated
            }
        } catch (error) {
            console.log('Error updating todo:', error);
        }
    };

    return (
        <div>
            <input type="text" value={newTitle} onChange={handleTitleChange} />
            <button onClick={handleUpdateTodo}>Update Todo</button>
        </div>
    );
};

export default UpdateTodo;
