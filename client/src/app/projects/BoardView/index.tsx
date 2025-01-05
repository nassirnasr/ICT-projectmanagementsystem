import { Priority, useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import React from 'react'
import {DndProvider, useDrag, useDrop} from "react-dnd";// drag and drop
import { HTML5Backend } from "react-dnd-html5-backend"
import { Task as TaskType } from '@/state/api';
import { EllipsisVertical, MessageSquare, MessageSquareMore, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Span } from 'next/dist/trace';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const taskStatus = ["To Do" , "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen}: BoardProps) => {
  const {data: tasks, isLoading, error} = useGetTasksQuery({projectId: Number(id)});

  //from the api update tsk
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
    //drag and drop
  const moveTask = (taskId:number, toStatus: string) =>{
    updateTaskStatus({taskId, status: toStatus});

    if(isLoading) return <div>Loading...</div>
    if(error) return <div>An error occured while fetching tasks</div>
  }


  //drag and drop 
  return <DndProvider backend={HTML5Backend}>
    <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4'>
      {taskStatus.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks || []}
          moveTask={moveTask}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
      ))}
    </div>
  </DndProvider>;
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask : (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen : (isOpen: boolean) => void;
}


type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTabSplit = Array.isArray(task.tags)
    ? task.tags
    : typeof task.tags === 'string'
    ? task.tags.split(",")
    : [];

  const formattedStartDate = task.startDate 
    ? format(new Date(task.startDate), "P") 
    : "";

  const formattedDueDate = task.dueDate 
    ? format(new Date(task.dueDate), "P") 
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div 
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent" ? "bg-red-200 text-red-700" 
        : priority === "High" ? "bg-yellow-200 text-yellow-700"
        : priority === "Medium" ? "bg-green-200 text-green-700"
        : priority === "Low" ? "bg-blue-200 text-blue-700"
        : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );



  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary
      ${isDragging ? "opacity-50" : "opacity-100"}
      `}
    >
      {/* {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileUrl}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )} */}

      <Image
        src="/nasr.jpg"
        alt="Random Image"
        width={400}
        height={200}
        className="h-auto w-full rounded-t-md"
      />

      <div className='p-4 md:p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            {task.priority && <PriorityTag priority = {task.priority} />}
            <div className='flex gap-2'>
              {taskTabSplit.map((tag) => (
                <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs'>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className='flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500 '>
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className='my-3 flex flex-col justify-between'>
          <h4 className='text-md font-bold dark:text-white'>
            {task.title}
          </h4>

          {/* POINTS */}
          {typeof task.points === "number" && (
            <div className='text-xs font-semibold dark:text-white'>
              {task.points} pts
            </div>
          )}

          <div className='text-xs text-gray-500 dark:text-neutral-500'>
            {formattedStartDate && <span>{formattedStartDate} - </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>} 
          </div>
          <p className='text-sm text-gray-600 dark:text-neutral-500 '>
            {task.description}
          </p>
          <div className='mt-4 border-t border-gray-200 dark:border-stroke-dark'></div>
          {/* USERS */}
          <div className='mt-3 flex items-center justify-between'>
            <div className='flex -space-x-[6px] overflow-hidden'>
              {task.assignee && (
                <Image 
                  key={task.assignee.userId}
                  src={`/${task.assignee.profilePictureUrl!}`}
                  alt={task.assignee.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}

              {task.author && (
                <Image 
                  key={task.author.userId}
                  src={`/${task.author.profilePictureUrl!}`}
                  alt={task.author.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
            </div>
             {/* COMMENTS */}
            <div className='flex items-center text-gray-500 dark:text-neutral-500'>
              <MessageSquareMore size={20}/>
              <span className='ml-1 text-sm dark:text-neutral-400'>
                {numberOfComments}
              </span>
              {/* Open up the comment*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


//TASK COLUMN
const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
} : TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: {id: number}) => moveTask(item.id, status),
    collect: (monitor:any) => ({
      isOver: !! monitor.isOver()
    })
  }));

  const taskcount = tasks.filter((task) => task.status === status).length;

  //change color according to status
  const statusColor: any ={
    "To Do": "#D97706",
    "Work In Progress": "#6B7280",
    "Under Review" : "#059669",
    Completed: "#2563EB",
  }

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg py-2 xl:px-2 ${
        isOver ? "bg-blue-100 dark:bg-neutral-950" : ""
      }`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
          {/* task count */}
          <span
          className='ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary'
          style={{ width: "1.5rem" , height: "1.5rem"}} 
          >
            {taskcount}
          </span>
          </h3>
          <div className='flex items-center gap-1'>
            <button className='flex h-6 w-5 items-center justify-center dark:text-neutral-500'>
              <EllipsisVertical size={26} />
            </button>
            <button className='flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white'
              onClick={() => setIsModalNewTaskOpen(true)}>
              <Plus size={16} />
              </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
          ))}
    </div>
  );


  
  };

export default BoardView;