import { SectionTitle } from "../ui/section-title";
import classes from "./about.module.scss";

export function AboutSection() {
   return (
      <div className={classes.container} id="about">
         <SectionTitle title="About" />
         <img src="/about/bg-texture.svg" className={classes.texture} />

         <div className={classes.centered_div}>
            <img src="/about/me.webp" />
            <div className={classes.txt_box}>
               <h3>Hello</h3>
               <br />
               <p>
                  I'm a self-taught full-stack developer, constantly on the journey of learning and leveling up my
                  skills. There's something incredibly satisfying about crafting cool applications that bring ideas to
                  life. TypeScript is my coding sidekick, and I love dancing in the realms of ReactJS and NodeJs.
               </p>
               <br />
               <p>
                  Apart from coding, I'm all about football, especially cheering for Real Madrid. When I'm not on the
                  field, you'll catch me snapping pics or planning my next adventure.
               </p>
            </div>
         </div>
      </div>
   );
}
