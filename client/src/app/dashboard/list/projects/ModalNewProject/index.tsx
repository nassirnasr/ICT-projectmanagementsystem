import Modal from '@/components/Modal';
import { useCreateProjectMutation } from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async () => {
        if (!projectName || !startDate || !endDate) {
            alert("Please fill in all required fields (Project Name, Start Date, End Date)");
            return;
        }

        try {
            // Format dates to ISO string with local timezone
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                alert("End date cannot be earlier than start date");
                return;
            }

            const formattedStartDate = start.toISOString();
            const formattedEndDate = end.toISOString();

            console.log("Submitting project with dates:", {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            });

            await createProject({
                name: projectName,
                description,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }).unwrap();
            onClose(); // Close modal after successful submission
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Failed to create project. Please check the console for details.");
        }
    };

    const isFormValid = () => {
        if (!projectName || !startDate || !endDate) return false;
        return new Date(endDate) > new Date(startDate);
    };

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
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
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    autoFocus
                    required
                    aria-label="Project Name"
                />

                <textarea
                    className={inputStyles}
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="Project Description"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        aria-label="Start Date"
                    />
                    <input
                        type="date"
                        className={inputStyles}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        aria-label="End Date"
                    />
                </div>

                <button
                    type="submit"
                    className={`mt-4 flex justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus-offset-2 ${
                        !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? "Creating..." : "Create Project"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewProject;
