import Modal from '@/components/Modal';
import { Priority, Status, useCreateProjectMutation, useCreateTaskMutation } from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?:string | null;
};

const ModalNewTask = ({ isOpen, onClose ,id = null}: Props) => {
    const [createTask , {isLoading}] = useCreateTaskMutation();;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status | null>(null); // Allow null for default
    const [priority, setPriority] = useState<Priority | null>(null); // Allow null for default
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [authorUserId, setAuthorUserId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [projectId, setProjectId] = useState("");
    
    
    

    const handleSubmit = async () => {
        if (!title || !authorUserId || !(id !==null || projectId)) {
            alert("Please fill in all required fields, including dates.");
            return;
        }
    
        const start = new Date(startDate);
        const due = new Date(dueDate);
    
        if (due < start) {
            alert("Due date cannot be earlier than the start date.");
            return;
        }
    
        try {
            const formattedStartDate = formatISO(start, { representation: 'complete' });
            const formattedDueDate = formatISO(due, { representation: 'complete' });
    
            await createTask({
                title,
                description,
                status: status || undefined, // Convert null to undefined
                priority: priority || undefined, // Convert null to undefined
                tags,
                startDate: formattedStartDate,
                dueDate: formattedDueDate,
                authorUserId: parseInt(authorUserId),
                assignedUserId: parseInt(assignedUserId),
                projectId: id !== null ? Number(id) : Number(projectId),
            }).unwrap();
    
            onClose(); // Close modal after successful submission
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("An error occurred while creating the task. Please try again.");
        }
    };
    

    const isFormValid = () => {
        return title && authorUserId && !(id !==null || projectId);
    };

    const selectStyles = 
        "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Taskt">
            <form
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Title"
                />

                <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="Task Description"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                     <select
                        className={selectStyles}
                        value={status || ""} // Use an empty string for default
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            setStatus(selectedValue ? (selectedValue as Status) : null); // Update the state correctly
                        }}
                    >
                        <option value="" disabled>
                            Select Status
                        </option>
                        <option value={Status.ToDo}>To Do</option>
                        <option value={Status.WorkInProgress}>Work in Progress</option>
                        <option value={Status.UnderReview}>Under Review</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>

                    <select
                        className={selectStyles}
                        value={priority || ""} // Use an empty string for default
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            setPriority(selectedValue ? (selectedValue as Priority) : null); // Update the state correctly
                        }}
                    >
                        <option value="" disabled>
                            Select Priority
                        </option>
                        <option value={Priority.Urgent}>Urgent</option>
                        <option value={Priority.High}>High</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.Backlog}>Backlog</option>
                    </select>

</div>

                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    autoFocus

                    aria-label="Tags"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        aria-label="Start Date"
                    />
                    <input
                        type="date"
                        className={inputStyles}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        aria-label="End Date"
                    />
                </div>

                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Author User ID"
                    value={authorUserId}
                    onChange={(e) => setAuthorUserId(e.target.value)}
                    autoFocus
                    required
                    aria-label="Author User Id"
                />
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Assigned User ID"
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    autoFocus
                    aria-label="Assigned User ID"
                />
                {id == null && (
                    <input
                    type="text"
                    className={inputStyles}
                    placeholder="Project ID"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    autoFocus
                    aria-label="Project ID"
                />
                )}
                <button
                    type="submit"
                    className={`mt-4 flex justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus-offset-2 ${
                        !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? "Creating..." : "Create Task"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewTask;
