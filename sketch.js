var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("Happy dog.png");
//garden=loadImage("images/Garden.png");
//washroom=loadImage("images/WashRoom.png");
//bedroom=loadImage("images/BedRoom.png");
}

function setup() {
  createCanvas(1000,500);
  database=firebase.database();

  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);


  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("FEED DOGO");
  feed.position(500,15);
  feed.mousePressed(feedDog);

  addFood=createButton("ADD FOOD");
  addFood.position(400,15);
  addFood.mousePressed(addFoods);
}

function draw() {
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
      text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }else if(lastFed==0){
      text("Last Feed : 12 AM",350,30);
  }else{
      text("Last Feed : "+ lastFed + " AM", 350,30);
  }

  //currentTime=hour();
  //if(currentTime==(lastFed+1)){
     // update("Playing");
      //foodObj.garden();
 //  }else if(currentTime==(lastFed+2)){
    //update("Sleeping");
      //foodObj.bedroom();
  // }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    //update("Bathing");
      //foodObj.washroom();
  // }else{
    //update("Hungry")
    //foodObj.display();
   //}
   

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

var food_stock_val = foodObj.getFoodStock();
if(food_stock_val <=0){
  foodObj.updateFoodStock(food_stock_val *0);
}else{
  foodObj.updateFoodStock(food_stock_val -1);
}

  //foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}