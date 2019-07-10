/* eslint-disable react/wrap-multilines */
/* eslint-disable react/require-extension */
/* eslint-disable react/jsx-sort-prop-types */
var todoText;
//create array to hold audio binary data
audioChunks = [];

$(document).ready(function () {
    $('.modal').modal();
});

//add new todo
$("input[type='text']").keypress(function(event) {
    if (event.which === 13){
        //verify if input is empty
        if ($(this).val() === '') {
            alert('To-do can not be empty, please add a task or a description');
        } 
        else{
        //grab value of input and save it to a variable
        todoText = $(this).val();
        $(this).val('');
        //create a new li and add it to ul
        $('ul').append('<li><span><i class="fa fa-trash fa-xs"></i></span> ' + todoText + '</li>');
        }
    }
});

//Check off(strikeout/linethrough) specific todos by clicking 
$('ul').on('click', 'li',function() {
    $(this).toggleClass('completed');
});

//click on X to delete todo
$('ul').on('click', 'span', function(e) {
    $(this).parent().slideUp(1000, function() {
        $(this).remove();
    });
    e.stopPropagation();
});

//toggle input
$('.fa-plus-circle').click(function(){
    $("input[type='text']").fadeToggle(1000);
    $('.inputWithIcon').fadeToggle(1000);
});

var counter = -1;
var store = [];

//MediaDevices API gives access to connected media (microphones and cameras)
//getUserMedia API handles streaming from user's microphone and asks for permission
//so i passed an object specifying the type of media i want to stream audio:true
//Begin streaming audio
  navigator.mediaDevices.getUserMedia({ audio: true})
      .then(stream => {handlerFunction(stream);});

function handlerFunction(stream) {
    rec = new MediaRecorder(stream);
    //wait for the streamed audio data to become available then execute a callback function to handle the data
    rec.ondataavailable = e => {
        audioChunks.push(e.data);
        if (rec.state === 'inactive') {
            todoText = $("input[type='text']").val();
            let blob = new Blob(audioChunks, {type:'audio/mpeg-3'});

            let details = {
                todoText: todoText,
                blob: blob
            };
            store.push(details);
            //console.log(store);
            localStorage.setItem('id', JSON.stringify(details));

          
            for (let i = 0; i < store.length; i++) {
                /* const element = array[i]; */
                //id = '"#recordedAudio' + [i] + '"';
                $('ul').append('<li><span><i class="fa fa-trash fa-xs"></i></span>' + store[i].todoText +  '<br> <i id="playRecord" class="fas fa-play-circle"></i>  <audio id="recordedAudio' + [i] + '"></audio></li>');
                let id = '"#recordedAudio' + [i] + '"';
                let selector = $('audio');
                let src = URL.createObjectURL(store[i].blob);
                $(selector).attr('src',src);  
                /* $(selector).attr('src',store[i].blob);   */
                $(selector).attr('controls', true);
                $(selector).attr('autoplay', true);

             
             console.log(id);
             console.log(store[i].blob);
            }
            
        }
    };
}

let downloadTimer;
let timerFunction;
let timeleft;

$('#startRecord').on('click', function(event) {
    console.log('i was clicked');
    $(this).attr('disabled', true);
    /* $(this).css('background-color', 'blue'); */
    $('#stopRecord').attr('disabled', false);
    
    //start recording
    rec.start();

    //20 seconds timer countdown
    var timeleft = 20;
        downloadTimer = setInterval(function(){
        timeleft--;
        $("#countdowntimer").text(timeleft); 
        if(timeleft <= 0)
            clearInterval(downloadTimer);
        },1000);

        //timeout function to stop recording after 20 seconds
    timerFunction = setTimeout(() => {
        if (rec.state === 'inactive') {
            //do nothing
        } else {
            rec.stop();
        }
    }, 20000);

    
});

$('#stopRecord').on('click', function(event){
    console.log('i was clicked');
    //enable record button
    $('#startRecord').attr('disabled', false);
    //disable stop record button
    $(this).attr('disabled', true);
    clearTimeout(timerFunction);
    clearInterval(downloadTimer);
    rec.stop();
    timeleft = 20;
    $("#countdowntimer").text(timeleft);
    counter ++;
});

//check if input is empty before opening recording modal
$('.modal-trigger').on('click', function(event){
    if ($("input[type='text']").val() === '') {
        alert("Add a description for Voice Note before recording");
        //prevent modal from opening(triggering)
        event.stopPropagation();
    }
});

$('ul').on('click', '#playRecord',function(e) {
    if ( !!$('#recordedAudio').attr('controls') === true) {
        $('#recordedAudio').attr('controls', false);
        $('#recordedAudio').attr('autoplay', false);
    } else {
        $('#recordedAudio').attr('controls', true);
        $('#recordedAudio').attr('autoplay', true);
    }
    //prevent the strikeout on the play icon
    e.stopPropagation();
});


//Local Storage

localStorage.setItem('name', 'Juan');

//add to session storage
//sessionStorage.setItem('name', 'Juan');

//remove from local storage
//localStorage.removeItem('name');

//read the value
//const name = localStorage.getItem('name');
//console.log(name);

//Clear local storage
//localStorage.clear();