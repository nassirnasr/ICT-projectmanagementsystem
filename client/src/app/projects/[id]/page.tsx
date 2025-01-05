"use client";
import React, { useState } from "react";
import { use } from "react";
import ProjectHeader from "../ProjectHeader";
import Board from "../BoardView"
import List from "../ListView"
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";

type Props = {
  params: Promise<{ id: string }>; 
};

const Project = ({ params }: Props) => {
  // Unwrap the `params` Promise
  const { id } = use(params);
  
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsNewTaskOpen] = useState(false);

  return (
    <div>
      <ModalNewTask 
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        id={id}/>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      { activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsNewTaskOpen}/>
      )}
      { activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsNewTaskOpen}/>
      )}
      { activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsNewTaskOpen}/>
      )}
      { activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsNewTaskOpen}/>
      )}
    </div>
  );
};

export default Project;
