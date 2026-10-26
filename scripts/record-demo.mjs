import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdirSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
const slug=process.env.DEMO_SLUG;if(!['forma','signal','ember','volt'].includes(slug))throw Error('DEMO_SLUG required');
mkdirSync('recordings',{recursive:true});const server=spawn(process.execPath,['scripts/serve-performance.mjs'],{env:{...process.env,PORT:'4178'},stdio:'ignore'});
const wait=ms=>new Promise(r=>setTimeout(r,ms));let browser;
try{
 for(let i=0;i<30;i++){try{if((await fetch('http://127.0.0.1:4178/')).ok)break}catch{}await wait(250)}
 browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,recordVideo:{dir:'recordings/raw',size:{width:1280,height:800}}});const page=await context.newPage();
 const start={forma:'/projects/pine-house/',signal:'/#program',ember:'/#taste',volt:'/#configure'}[slug];await page.goto('http://127.0.0.1:4178'+start);await page.emulateMedia({reducedMotion:'reduce'});
 if(slug==='forma'){
 const group=page.getByRole('group',{name:'Вариант концепции'});await group.scrollIntoViewIfNeeded();await wait(700);await page.screenshot({path:'recordings/forma-poster.png'});await group.getByRole('button',{name:/Единый объём/}).click();await wait(1400);await group.getByRole('button',{name:/Два крыла/}).click();await wait(1800);
 }else if(slug==='signal'){
 await page.getByRole('button',{name:'ОБЕ СЦЕНЫ',exact:true}).click();await page.getByRole('button',{name:'Добавить VELVET STATIC в мою программу',exact:true}).click();await page.getByRole('button',{name:'Добавить SOFT ERROR в мою программу',exact:true}).click();await page.getByRole('button',{name:/Я НА ФЕСТИВАЛЕ/}).click();const panel=page.getByRole('region',{name:'Режим фестиваля'});await panel.scrollIntoViewIfNeeded();await wait(700);await page.screenshot({path:'recordings/signal-poster.png'});await panel.getByRole('slider').press('Home');for(let i=0;i<24;i++)await panel.getByRole('slider').press('ArrowRight');await wait(2200);for(let i=0;i<6;i++)await panel.getByRole('slider').press('ArrowRight');await wait(1800);
 }else if(slug==='ember'){
 await page.getByLabel('Воронка / фильтр',{exact:true}).check();await page.getByLabel('Чёрным',{exact:true}).check();await page.getByLabel('Шоколад и орехи',{exact:true}).check();await page.getByRole('button',{name:'Подобрать мой кофе',exact:true}).click();const comparison=page.getByRole('region',{name:'Сравнение рекомендаций'});await comparison.scrollIntoViewIfNeeded();await wait(800);await page.screenshot({path:'recordings/ember-poster.png'});await comparison.getByRole('button',{name:/Попробовать этот ответ/}).click();await wait(2200);
 }else{
 await page.getByRole('button',{name:'Запомнить вариант A',exact:true}).click();await page.getByRole('button',{name:'Цвет Терракота',exact:true}).click();await page.getByRole('button',{name:/Long \/ 540 Wh/}).click();await page.getByRole('button',{name:'Запомнить вариант B',exact:true}).click();const comparison=page.getByRole('region',{name:'Сравни свой ритм.'});await comparison.getByRole('table').scrollIntoViewIfNeeded();await wait(800);await page.screenshot({path:'recordings/volt-poster.png'});await comparison.getByRole('button',{name:'Применить A',exact:true}).click();await wait(1800);
 }
 const video=page.video();await context.close();renameSync(await video.path(),resolve('recordings',slug+'.webm'));
}finally{await browser?.close();server.kill()}
