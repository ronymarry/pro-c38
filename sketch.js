//Create variables here
var dog, Dimg, Dimg2;
var database; 
var foodStock,foodS;
var fedTime,currentTime;
var lastFed;
var feed, addFood;
var foodObject;
var garden, bedroom,washroom;
var gameState,readState;


function preload()
{
  //load images here
  Dimg = loadImage("dogImg.png");
  Dimg2 = loadImage("dogImg1.png");

  bedroomImg = loadImage("Bed Room.png")
  gardenImg = loadImage("Garden.png")
  washroomImg = loadImage("Wash Room.png")

}

function setup() {

  database = firebase.database();

  createCanvas(400, 500);

  foodObject = new Food();


  foodStock = database.ref('Food');
  foodStock.on("value", readStock);


  fedTime = database.ref('FedTime');
  fedTime.on("value",function (data){
  lastFed = data.val();
   });


  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
   gameState=data.val();
  });


  
  dog = createSprite(250, 380, 10, 10);
  dog.addImage("Dog",Dimg);
  dog.scale = 0.2


  feed = createButton("FEED DRAGO");
  feed.position(480,50);
  feed.mousePressed(FeedDog);


  add = createButton("ADD FOOD");
  add.position(600,50);
  add.mousePressed(AddFood);

}


function draw() {  
    background(46,139,87);
    foodObject.display();

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObject.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObject.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObject.washroom();
   }else{
    update("Hungry")
    foodObject.display();
   }
   

   if(gameState!="Hungry"){
     feed.hide();
     add.hide();
     dog.remove();
   }else{
    feed.show();
    add.show();
    dog.addImage(Dimg);
   }
 
  drawSprites();
  //add styles here
}

//function to read values in database
function readStock(data){
  foodS = data.val();
  foodObject.updateFoodStock(foodS);


}

//function to wite values in database
function writeStock(x){

  if(x>0){
    x= x-1
  }
  else{
    x = 0
  }

  database.ref('/').update({
    'Food':x
  });
}

function AddFood(){
 foodS++
  database.ref('/').update({
    'Food':foodS
  }
  
  )
  }
  function FeedDog(){
  
  dog.addImage(Dimg2)
  foodObject.updateFoodStock(foodObject.getFoodStock()-1)
   database.ref('/').update({
     'Food':foodObject.getFoodStock(),
     FeedTime:hour(),
     gameState:"Hungry"
   });
  }

  //update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}