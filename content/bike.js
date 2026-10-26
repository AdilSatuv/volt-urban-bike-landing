export const finishes=[{id:"mist",name:"Туман",color:"#bfd8cf",price:0},{id:"ember",name:"Терракота",color:"#e27654",price:4000},{id:"ink",name:"Графит",color:"#354346",price:4000}];
export const batteries=[{id:"city",name:"City / 360 Wh",capacity:360,price:0},{id:"long",name:"Long / 540 Wh",capacity:540,price:18000}];
export const basePrice=129000;
export function estimateRange(capacity,assist,terrain){
 if(![360,540].includes(capacity)||![1,2,3].includes(assist)||!["flat","mixed","hills"].includes(terrain))throw new RangeError("Invalid estimate inputs");
 const use=[0,6,8,11][assist]*{flat:1,mixed:1.18,hills:1.45}[terrain];
 return Math.round(capacity/use);
}
export function configurationPrice(finish,battery){const f=finishes.find(x=>x.id===finish),b=batteries.find(x=>x.id===battery);if(!f||!b)throw new RangeError("Unknown configuration");return basePrice+f.price+b.price;}
