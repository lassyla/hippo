//BUGS: 
//-path not updating correctly
//-on randomize, shows random dotted line 
//-my rectangle is not showing up. why(line 95)

var width = 500;
var height = 500;
var padding = 20;
var numPoints = 11;
var defs;
var edgeMatrix;
var points;
var hippo;
var currentNode = 0;
var imgRadius = 20;
var speed = 5;
var visitedNodes = [0];
var moving;
var distanceTraveled = 0;
var randomPath = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var bfPath = [0, 1, 3, 2, 4, 5, 6, 7, 8, 9, 10];
var nnPath = [0, 1, 2, 3, 4, 6, 5, 9, 8, 7, 10];
var buttonOn = [false, false, false]; 
var randomDist = 0;
var nnDist = 0; 
var bfDist = 0; 

getRandomPoints();
drawStuff();
calculatePaths(); 


function randomColor(){
  return "hsl(" + Math.random() * 360 + ", 100%, 50%)";
}

function getDist(node1, node2) {
  return Math.round(Math.sqrt(Math.pow(points[node1][0]-points[node2][0], 2) + Math.pow(points[node1][1]-points[node2][1], 2)))
}

function getRandomPoints() {
  points = [[padding, height + padding, 0, randomColor()]];
  for(var i = 1; i < numPoints; i++){
    points.push([Math.random()*height + padding, Math.random()*width + padding, i, randomColor()]);
  }
  edgeMatrix = [];
  for(var i = 0; i < numPoints; i++){
    edgeMatrix[i] = []
    for(var j = 0; j < i; j++){
      dist = getDist(i, j)
      edgeMatrix[i][j] = dist;
      edgeMatrix[j][i] = dist;
    }
  }
}

function drawStuff(){

  var svg = d3.select("#holder")
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2);

  svg.append("g")
    .attr("id", "dashedlines");


  svg.append("g")
    .append("text")
    .attr("x", width / 2 + padding)
    .attr("y", height / 2 + padding)
    .text(distanceTraveled);
  svg.append("g")
    .attr("id", "lines0")
    .style("opacity", 0)
  svg.append("g")
    .attr("id", "lines1")
    .style("opacity", 0);
  svg.append("g")
    .attr("id", "lines2")
    .style("opacity", 0);

  var nodes = d3.select("svg")
    .selectAll("dot")
      .data(points)
    .enter().append("circle")
      .attr("r", 10)
      .attr("fill", (d, i)=>points[i][3])
      .attr("cx", (d, i)=>points[i][0])
      .attr("cy",  (d, i)=>points[i][1])
      .attr("id", (d) => "circle" + d)
      .on("click", function(d, i){travelTo(i, this)})
  

  d3.select("#chart")
    .append("svg")
    .attr("height", "height")
    .selectAll("rect")
    .data([0, 0, 0, 0])
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i)=>50 * i)
    .attr("y", height)
    .attr("width", 30)
    .attr("height", 0)
    .attr("id", (d, i)=>"bar" + i)
    
  hippo = svg
    .append("svg:image")
    .attr("xlink:href", "square.png")
    .attr("width", imgRadius * 2)
    .attr("height", imgRadius * 2)
    .attr("opacity", .5)
    .attr("x", padding - imgRadius)
    .attr("y", height + padding - imgRadius);
  
}

function randomize() {
  moving = true;
  d3.select("#dashedlines").selectAll("line")
  .transition()
  .duration(1000)
  .style("opacity", 0)
  .each("end", function(){
    d3.select(this).remove();
    d3.select("text").text("0");
    distanceTraveled = 0;
  })

  getRandomPoints();
  visitedNodes = [];
  randomDist = movePath(randomPath, 0)
  randomDist = movePath(nnPath, 1)
  randomDist = movePath(bfPath, 2)

  travelTo(0);
  distanceTraveled = 0;
  d3.select("#bar3")
    .transition()
    .duration(1000)
    .attr("height", distanceTraveled / 10)
    .attr("y", height - distanceTraveled / 10)

  d3.select("text").text("0");
  moving = true;
  d3.selectAll("circle")
    .transition()
      .duration(1001)
      .attr("fill", (d, i)=>points[i][3])
      .attr("r", 10)
      .attr("cx", (d, i)=>points[i][0])
      .attr("cy",  (d, i)=>points[i][1])
      .each("end", function(){moving = false;  });
}


function travelTo(index, node) {
  if((!visitedNodes.includes(index) && !moving && index != 0) 
     || (index == 0 && visitedNodes.length == randomPath.length ) 
     || (index == 0 && visitedNodes.length == 0)){
    moving = true;
    var dist = getDist(index, currentNode);
    var line = d3.select("g").append("line")
      .attr("x1", points[currentNode][0])
      .attr("y1", points[currentNode][1])
      .attr("x2", points[currentNode][0])
      .attr("y2", points[currentNode][1])
      .attr("class", "dashedPath")
    visitedNodes.push(index);
    distanceTraveled += dist;
    currentNode = index;
    d3.select("#bar3")
      .transition()
      .ease("linear")
      .duration(500)
      .attr("height", distanceTraveled / 10)
      .attr("y", height - distanceTraveled / 10)

    hippo.transition()
      .ease("linear")
      .duration( dist * 10 / speed)
      .attr("x", points[index][0] - imgRadius)
      .attr("y", points[index][1] - imgRadius)
      .each("end", function(){
        moving = false;
        d3.select(node).transition().attr("r", 4);
        d3.select("text").text(distanceTraveled);
      });

    line.transition()
      .ease("linear")
      .duration( dist * 10 / speed)
      .attr("x2", points[index][0])
      .attr("y2", points[index][1])
    if(visitedNodes.length == randomPath.length + 1){
      console.log("gjkdfgkdfj") //indication that path is finished
    }
  }
}

function reset(){
  if(!moving){
    console.log("reset");
    d3.selectAll("circle").transition().duration(500).attr("r", 10);
    visitedNodes = [];
    travelTo(0);
    d3.select("#dashedlines")
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .each("end", function(){
        d3.select(this).remove();
        d3.select("text").text("0");
        distanceTraveled = 0;
      })
    }
}


function createPath(path, pathNum){
  pathDist = 0;
  var i = 0; 
  for(var i = 0; i < path.length; i ++){
    var line = d3.select("#lines" + pathNum).append("line")
      .attr("x1", points[path[i]][0])
      .attr("y1", points[path[i]][1])
      .attr("x2", points[path[(i + 1) % path.length]][0])
      .attr("y2", points[path[(i + 1) % path.length]][1])
    pathDist += getDist(path[i], path[(i + 1)% path.length]);
  }
  d3.select("#bar" + pathNum)
    .transition()
    .duration(1000)
    .attr("height", pathDist / 10)
    .attr("y", height - pathDist / 10)

  console.log(pathDist); 
  return pathDist;
}

function movePath(path, pathNum){

  pathDist = 0;
  var i = 0; 
  d3.select("#lines" + pathNum).selectAll("line").data(path)
    .transition()
    .duration(1000)
    .attr("x1", (d, i)=>{console.log(path); return points[path[i]][0]})
    .attr("y1", (d, i)=>points[path[i]][1])
    .attr("x2", (d, i)=>points[path[(i + 1) % path.length]][0])
    .attr("y2", (d, i)=>points[path[(i + 1) % path.length]][1])
    .each((d, i)=>pathDist += getDist(path[i], path[(i + 1)% path.length]))

  console.log(pathDist); 
 d3.select("#bar" + pathNum)
  .transition()
  .duration(1000)
  .attr("height", pathDist / 10)
  .attr("y", height - pathDist / 10)

  return(pathDist);

}

function calculatePaths() {
  //calculating random 
  for(var i = 0; i < 9; i ++){
    var b = randomPath[i];
    var x = Math.floor(Math.random() * (i+1));
    randomPath[i] = randomPath[x];
    randomPath[x] = b;
  }
  //calculating NN
  
  //calculating BF
  
  //adding these paths
  randomDist = createPath(randomPath, 0)
  nnDist = createPath(nnPath, 1)
  bfDist = createPath(bfPath, 2)

  //altering chart

}

function toggleButton(i){
  if(buttonOn[i]){
    buttonOn[i] = false;
    d3.select("#lines" + i)
      .style("opacity", 0); 
    document.getElementById("button" + i).className = ""; 
  }
  else{
    d3.select("#lines" + i)
      .style("opacity", 1); 
    buttonOn[i] = true; 
    document.getElementById("button" + i).className = "active"; 
  }
  return;
}
