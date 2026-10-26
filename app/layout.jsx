import localFont from "next/font/local";
import "./globals.scss";
const font=localFont({src:"./fonts/Golos.woff2",variable:"--font-body",display:"swap",weight:"400 900"});
export const metadata={metadataBase:new URL("https://volt-urban-bike-portfolio-1026.brightsmile128.chatgpt.site"),title:"VOLT One — город в твоём ритме",description:"Авторский концепт городского электровелосипеда. Выбери цвет и батарею, исследуй детали и рассчитай условный запас хода.",alternates:{canonical:"/"},robots:{index:false,follow:false},openGraph:{title:"VOLT One — город ближе. Ты свободнее.",description:"Один велосипед. Новый ритм. Портфолио-концепт.",images:[{url:"/og.png",width:1200,height:630}],type:"website",locale:"ru_RU"},twitter:{card:"summary_large_image",images:["/og.png"]}};
export default function Layout({children}){return <html lang="ru" className={font.variable}><body>{children}</body></html>;}
