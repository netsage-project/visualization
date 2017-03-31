function sortObjects (arr,property,type){
	var sort;
	switch(type){
		case "dec":
			sort = arr.sort(function(a, b) {return eval("b" + property) - eval("a"+ property)});
			break;
		case "inc":
			sort = arr.sort(function(a, b) {return eval("a"+ property) - eval("b" + property)});
			break;
		//increasing order as default
		default:
			sort = arr.sort(function(a, b) {return eval("b"+ property) - eval("a"+ property)});
			break;
	}
	return sort;
}

function sortNumber(a,b,type) {
    return a - b;
}

//Average
function avg (arr){
	if(Array.isArray(arr)!=true) arr = [arr];
	var sum=0;
	for (var each in arr){
		sum+=arr[each];
	}
	return sum/arr.length;
}
//Mode: Most commun value
function mode(){

}
//Median is the value that 50% are over and 50% are below
function median(arr){
	percentile(arr,50);
}

//Standart Deviation
function stdDev(arr){
	var sum =0;
	var average = d3.mean(arr);
	for (var each in arr){
		sum+= Math.pow(arr[each]-average,2);
	}
	return Math.sqrt(sum/arr.length)
}
//Percentile function. Returns a pivot where the number of sorted elements in the left are <= index
function percentile(arr,index){
	var x = (arr.length*index)/100;
	var ordArr = arr.slice(0);
	ordArr = ordArr.sort(sortNumber);
	if(x%1==0){
		return ordArr[Math.floor(x)+1];
	}else{
		return  (ordArr[Math.floor(x)]+ordArr[Math.floor(x)+1])/2;
	}
}