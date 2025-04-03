import { Project } from '@/state/api';
import React from 'react';

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6  mb-4 shadow-md transition hover:shadow-lg dark:bg-dark-secondary dark:text-white">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {project.name}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        {project.description}
      </p>
      <div className="mt-4 text-sm">
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Start Date:</span>{' '}
          {project.startDate}
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">End Date:</span>{' '}
          {project.endDate}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
