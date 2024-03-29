import { ProjectCard } from "../card/project-card";
import { SectionTitle } from "../ui/section-title";
import classes from "./work.module.scss";
import PROJECTS from "../../data/projects.json";

export function WorkSection() {
   return (
      <div className={classes.container} id="work">
         <SectionTitle title="My Work" />

         <div className={classes.grid_container}>
            {PROJECTS.map((p) => (
               <ProjectCard project={p} />
            ))}
         </div>
      </div>
   );
}
