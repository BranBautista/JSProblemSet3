var mousePosition;
var offset = [0,0];
var isDown = false;

const selectBorderColor = document.querySelector('.border__color');
const selectBorderThickness = document.querySelector('.border__thickness');
const selectBackgroundColor = document.querySelector('.backgroundColor');
const selectBorderRadius = document.querySelector('.border__radius');

var div = document.querySelector('.dragged');

div.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        div.offsetLeft - e.clientX,
        div.offsetTop - e.clientY
    ];
}, true);

document.addEventListener('mouseup', function() {
    isDown = false;
    if ((div.offsetLeft<244 && div.offsetLeft>24)){
        if ((div.offsetTop < 144 && div.offsetTop >24)){
        div.style.borderColor = selectBorderColor.value;
        div.style.borderWidth = selectBorderThickness.value;
        div.style.backgroundColor = selectBackgroundColor.value;
        div.style.borderRadius = selectBorderRadius.value;
        }
    }
}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {
    
            x : event.clientX,
            y : event.clientY
    
        };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top  = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

// function dragStart(event) {
//     event.dataTransfer.setData("Text", event.target.id);
//  //   document.getElementById("demo").innerHTML = "Started to drag the p element";
//   }
  
//   function dragEnd(event) {
//  //   document.getElementById("demo").innerHTML = "Finished dragging the p element.";
//  event.currentTarget.style.borderColor = selectBorderColor.value;
//   }
  
//   function allowDrop(event) {
//     event.preventDefault();
//   }
  
//   function drop(event) {
//     event.preventDefault();
//     var data = event.dataTransfer.getData("Text");
//     event.target.appendChild(document.getElementById(data));
//   }