import { finishes,batteries,configurationPrice,estimateRange } from '../content/bike.js';
export function configurationSummary({finish,battery,assist,terrain}){
 const price=configurationPrice(finish,battery),pack=batteries.find(b=>b.id===battery),paint=finishes.find(f=>f.id===finish),range=estimateRange(pack.capacity,assist,terrain);
 return {finish:paint.name,color:paint.color,battery:pack.name,capacity:pack.capacity,assist:['','Eco','Tour','Boost'][assist],terrain:{flat:'Ровный город',mixed:'Смешанный рельеф',hills:'Частые подъёмы'}[terrain],price,range};
}
export function compareConfigurations(a,b){const first=configurationSummary(a),second=configurationSummary(b);return {first,second,priceDelta:second.price-first.price,rangeDelta:second.range-first.range,sameConditions:a.assist===b.assist&&a.terrain===b.terrain};}
