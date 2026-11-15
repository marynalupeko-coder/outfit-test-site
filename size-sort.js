// Sort numeric sizes and clothing sizes from smallest to largest, preserving stock values.
const SIZE_RANK = {XXS:0,XS:1,S:2,M:3,L:4,XL:5,XXL:6,XXXL:7,XXXXL:8};
function sizeSortKey(value) {
  const s=String(value).trim().toUpperCase().replace(/\s+/g,' ').replace(/^(\d)XL$/,(_,n)=>'X'.repeat(Number(n))+'L');
  if (/^\d+(?:[.,]\d+)?$/.test(s)) return [0,Number(s.replace(',','.')),0,s];
  if (Object.prototype.hasOwnProperty.call(SIZE_RANK,s)) return [1,SIZE_RANK[s],0,s];
  const range=s.split(/\s*[-–—/]\s*/);
  if(range.length===2 && range.every(x=>Object.prototype.hasOwnProperty.call(SIZE_RANK,x)))return [1,SIZE_RANK[range[0]],SIZE_RANK[range[1]],s];
  if (/^(ONE SIZE|ONESIZE|OS|УНІВЕРСАЛЬНИЙ|УНИВЕРСАЛЬНЫЙ)$/.test(s)) return [3,0,0,s];
  return [2,0,0,s];
}
function compareSizes(a,b){const x=sizeSortKey(a),y=sizeSortKey(b);for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]<y[i]?-1:1;}return x[3].localeCompare(y[3],'uk',{numeric:true});}
