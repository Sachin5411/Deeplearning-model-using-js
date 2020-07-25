//========================================================================
// Drag and drop image handling
//========================================================================

var fileDrag = document.getElementById("file-drag");
var fileSelect = document.getElementById("file-upload");
var web_url_for_model=window.location.href

// Add event listeners
fileDrag.addEventListener("dragover", fileDragHover, false);
fileDrag.addEventListener("dragleave", fileDragHover, false);
fileDrag.addEventListener("drop", fileSelectHandler, false);
fileSelect.addEventListener("change", fileSelectHandler, false);

function fileDragHover(e) {
  // prevent default behaviour
  e.preventDefault();
  e.stopPropagation();

  fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
}

function fileSelectHandler(e) {
  // handle file selecting
  var files = e.target.files || e.dataTransfer.files;
  fileDragHover(e);
  for (var i = 0, f; (f = files[i]); i++) {
    previewFile(f);
  }
}

//========================================================================
// Web page elements for functions to use
//========================================================================

var imagePreview = document.getElementById("image-preview");
var imageDisplay = document.getElementById("image-display");
var uploadCaption = document.getElementById("upload-caption");
var predResult = document.getElementById("pred-result2");
var loader = document.getElementById("loader");
var model = undefined;

//========================================================================
// Main button events
//========================================================================


async function initialize() {
    model = await tf.loadLayersModel('model.json');
}

function select_file(){
  document.getElementById('modelUpload').click()
  upload_model()
}


async function upload_model() {
    const modelfile = document.getElementById('modelUpload').files[0];

// const model = await tfl.loadModel(tf.io.browserFiles(modelfile));
// var file=fileSelector.files[0];
if (modelfile) {
  // create reader
        // console.log(file)
        // var reader = new FileReader();
        // reader.readAsText(modelfile);
        // reader.onload = function(e) {
        //     // browser completed reading file - display it
        //     console.log("Using uploaded model")

        //     model_file=e.target.result;
        //     // localStorage.setItem("model.json",model_file)
        //     // model=model_file
        //     // console.log(model_file)
        // };
        // basepath = os.path.dirname(__file__)
        // console.log(basepath)
        console.log("Using Uploaded Model")
        // console.log(tf.io.browserFiles(modelfile.name))
        var link=web_url_for_model+modelfile.name
        console.log(link)
       model = await tf.loadLayersModel(link); 
       // model = await tf.loadLayersModel(model_file); 
    }
else{
  console.log("using pre-trained model")
  model = await tf.loadLayersModel('model.json'); 
  // await model.save('localstorage://my-model');

}
}


async function predict() {
  // action for the submit button
// const modelfile = document.getElementById('modelUpload').files[0];
// var file=fileSelector.files[0];


// console.log(file)
// console.log("filename")
// console.log(file.getAsText(""))
// console.log(file.name)
 



  if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
    window.alert("Please select an image before submit.");
    return;
  }

  let tensorImg = tf.browser.fromPixels(imagePreview).resizeNearestNeighbor([120,120]).toFloat().expandDims();
  var prediction = await model.predict(tensorImg).data();
  // var obj = {a: 1, b: 2, undefined: 1};
  var highestVal = Math.max.apply(null, Object.values(prediction)),
  val = Object.keys(prediction).find(function(a) {
    return prediction[a] === highestVal;
  });
  console.log("Predictions are")
  console.log(val)
  // console.log("Predictions are")
  // console.log(prediction)
  // console.log("Index")
  // console.log(max)

// console.log("tensorImg")
//   console.log(tensorImg)
  
  if (val == 0) {
      predResult.innerHTML = "Pikachu";

  } else if (val == 1) {
      predResult.innerHTML = "Bulbasaur";

  } else if (val == 2) {
      predResult.innerHTML = "Charmander";
  }
  show(predResult)

}

function clearImage() {
  // reset selected files
  fileSelect.value = "";

  // remove image sources and hide them
  imagePreview.src = "";
  imageDisplay.src = "";
  predResult.innerHTML = "";

  hide(imagePreview);
  hide(imageDisplay);
  hide(loader);
  hide(predResult);
  show(uploadCaption);

  imageDisplay.classList.remove("loading");
  document.getElementById("modelUpload").value = "";
}

function previewFile(file) {
  // show the preview of the image
  var fileName = encodeURI(file.name);

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imagePreview.src = URL.createObjectURL(file);

    show(imagePreview);
    hide(uploadCaption);

    // reset
    predResult.innerHTML = "";
    imageDisplay.classList.remove("loading");

    displayImage(reader.result, "image-display");
  };
}

//========================================================================
// Helper functions
//========================================================================

function displayImage(image, id) {
  // display image on given id <img> element
  let display = document.getElementById(id);
  display.src = image;
  show(display);
}

function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}

initialize();