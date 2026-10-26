"use client";
import { motion, useReducedMotion } from "framer-motion";
export function Reveal({children,className}){const reduced=useReducedMotion();return <motion.div className={className} initial={false} whileInView={reduced?{}:{opacity:[.4,1],y:[25,0]}} viewport={{once:true,amount:.15}} transition={{duration:.7,ease:[.22,1,.36,1]}}>{children}</motion.div>;}
