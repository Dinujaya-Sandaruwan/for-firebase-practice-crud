import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';

interface Todos {
    id: string;
    title: string;
    completed: boolean;
    imageUrl: string[];
}

const Todo = ({ onChangetodo }: any) => {
    const [todos, setTodos] = useState<Todos[]>([]);

    const todoCollectionRef = collection(db, 'todos');

    useEffect(() => {
        const getTodoList = async () => {
            const data = await getDocs(todoCollectionRef);

            const filteredData = data.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Todos[];

            console.log(filteredData);
            return filteredData;
        };

        const fetchData = async () => {
            const data = await getTodoList();
            setTodos(data);
        };

        fetchData();
    }, [onChangetodo]);

    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'todos', id));
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
        } catch (error) {
            console.log('Error deleting todo:', error);
        }
    };

    return (
        <div>
            <table>
                <thead></thead>
                <tbody>
                    {todos.map((todo) => (
                        <tr key={todo.id}>
                            <td>
                                {todo.imageUrl.length > 0 ? (
                                    todo.imageUrl.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={todo.title}
                                            style={{ width: '100px' }}
                                        />
                                    ))
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                            <td>{todo.id}</td>
                            <td>{todo.title}</td>
                            <td>
                                {todo.completed ? 'Completed' : 'Not Completed'}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Todo;
