import { useState } from 'react';
import AddTodo from './components/AddTodo';
import Preview from './components/Preview';
import Todo from './components/Todo';
import User from './components/User';

function App() {
    const [changeTodo, setChangeTodo] = useState<string>('');
    return (
        <div className="App">
            {/* <Preview /> */}
            <Todo onChangetodo={changeTodo} />
            <AddTodo onTodoAdded={setChangeTodo} />
            {/* <User /> */}
        </div>
    );
}

export default App;
