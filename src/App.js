import React, { useState } from "react";
import styled from "styled-components";
import Column from "./Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between
`;

const dataset = {
	tasks: {
		"task-1": { id: "task-1", content: "Content for task 1" },
		"task-2": { id: "task-2", content: "Content for task-2" },
		"task-3": { id: "task-3", content: "Content for task-3" },
		"task-4": { id: "task-4", content: "Content for task-4" },
	},
	columns: {
		"column-1": { id: "column-1", title: "Todo", taskIds: ["task-1"] },
		"column-2": { id: "column-2", title: "In progress", taskIds: ["task-2", "task-3"] },
		"column-3": { id: "column-3", title: "Review", taskIds: [] },
		"column-4": { id: "column-4", title: "Completed", taskIds: ["task-4"] },
	},
	columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

const App = () => {
	const [data, setData] = useState(dataset);
	const [task, setTask] = useState("");
	const handleChange = (event) => {
		setTask(event.target.value);
		// console.log(task)
	};
	const onAddTask = () => {
		console.log(task);
		// setData(current => cu)
		// setData(current => current.tasks[`task-${task}`] = { id: `task-${task}`, content: task })
		// setData(current => data.columns["column-1"] = { ...current.columns["column-1"], taskIds: [...current.columns["column-1"].taskIds, task] })
		setData(current => console.log(current))
		const toPush =  { id: `task-${task}`, content: task }
	};

	const onDragEnd = (result) => {
		const { destination, source, draggableId, type } = result;
		//If there is no destination
		if (!destination) return;

		//If source and destination is the same
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		//If you're dragging columns
		if (type === "column") {
			const newColumnOrder = Array.from(data.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);
			const newState = { ...data, columnOrder: newColumnOrder };
			setData(newState);
			return;
		}

		//Anything below this happens if you're dragging tasks
		const start = data.columns[source.droppableId];
		const finish = data.columns[destination.droppableId];

		//If dropped inside the same column
		if (start === finish) {
			const newTaskIds = Array.from(start.taskIds);
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);
			const newColumn = { ...start, taskIds: newTaskIds };
			const newState = {
				...data,
				columns: {
					...data.columns,
					[newColumn.id]: newColumn,
				},
			};
			setData(newState);
			return;
		}

		//If dropped in a different column
		const startTaskIds = Array.from(start.taskIds);
		startTaskIds.splice(source.index, 1);
		const newStart = { ...start, taskIds: startTaskIds };

		const finishTaskIds = Array.from(finish.taskIds);
		finishTaskIds.splice(destination.index, 0, draggableId);
		const newFinish = { ...finish, taskIds: finishTaskIds };

		const newState = {
			...data,
			columns: {
				...data.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish,
			},
		};

		setData(newState);
	};

	return (
		<>
			<Container>
				<TextField id="outlined-basic" label="Task"  variant="outlined" value={task} onChange={handleChange} />
				<Button variant="contained" onClick={() => { onAddTask(); }}>Add Task</Button>
			</Container>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="all-columns" direction="horizontal" type="column">
					{(provided) => (
						<Container {...provided.droppableProps} ref={provided.innerRef}>
							{data.columnOrder.map((id, index) => {
								const column = data.columns[id];
								const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
								return <Column key={column.id} column={column} tasks={tasks} index={index} />;
							})}
							{provided.placeholder}
						</Container>
					)}
				</Droppable>
			</DragDropContext>
		</>
	);
};

export default App;
