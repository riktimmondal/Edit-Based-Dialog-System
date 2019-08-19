var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
    'delete',
    'insert',
    'put'
]

//var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('#dictation');
var textBtn = document.querySelector('#text');

function textSpeech() {
    textBtn.disabled = true;
    textBtn.textContent = 'Test in progress';

    var inputText = document.getElementById("inputText").value;
    console.log(inputText);

    var phrase = phrases[0];
    /*phrase = phrase.toLowerCase();
    phrasePara.textContent = phrase;*/

    resultPara.textContent = 'Successful or not';
    diagnosticPara.textContent = 'edited messages will be..';

    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar , 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();


  recognition.onresult = function(event) {
   
    var speechResult = event.results[0][0].transcript.toLowerCase();
    var speechResultList=speechResult.split(" ");
    if(speechResultList[0].toLowerCase() ==='please')
    {
        speechResultList=speechResultList.splice(1);
    }
    console.log(speechResultList);
    console.log(typeof(speechResultList));

    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';

    var query = speechResultList[0].toLowerCase();
    var entity = speechResultList[1].toLowerCase();

    if(query === 'delete' || query ==='remove') 
    {
        if( speechResultList.length <= 2) //single
        {
            var re = new RegExp("\\b" + entity + "\\b",'i')
            console.log(re);
            var result = inputText.replace(re,"");
        }
        else //group
        {
            var result=inputText;
            if(entity === 'group')
            {
               speechResultList.splice(2).forEach(function(word)
               {
                   console.log(word);
                   var re = new RegExp("\\b" + word + "\\b",'i')
                   result = result.replace(re,"");
               });
            }
            else 
            {
                speechResultList.splice(1).forEach(function(word)
                {
                    console.log(word);
                    var re = new RegExp("\\b" + word + "\\b",'i')
                    result = result.replace(re,"");
                });
            }
        }
      resultPara.textContent = result;
      resultPara.style.background = 'lime';
    } else if(query === 'add' || query ==='put') //single
    {
        var position = speechResultList[2]; 
        var positionText = speechResultList[3];
        var re = new RegExp("\\b" + positionText + "\\b",'i')
        var index = inputText.search(re);
        var result = ''
        if(index >= 0)
        {
            if(position === 'after')
            {
                console.log(index);
                result = inputText.substring(0,index+ positionText.length)+ ' '+ entity +inputText.substring(index+ positionText.length);
                console.log(result);

            } else if(position === 'before' )
            {
                console.log(index);
                result = inputText.substring(0,index)+entity+' ' + inputText.substring(index);
                console.log(result);

            } else if(position === 'between')
            {
                re_bn=new RegExp("\\b" + speechResultList[5] + "\\b",'i');
                var index_bn = inputText.search(re_bn);
                if(index_bn >= 0)
                {
                    result = inputText.substring(0,index+ positionText.length+1)+entity+' '+inputText.substring(index+ positionText.length+1);
                }
                else
                {
                    result = 'could not recognise your words properly';
                }
                console.log(index_entityText);
                    console.log(index_bn);
                    console.log(result);
            }
        }
        else
        {
            result = 'could not recognise your words properly';
        }
        
        resultPara.textContent = result;
        resultPara.style.background = 'red';

    } 
    else if(query === 'move')
    {
        var position = speechResultList[2]; 
        var positionText = speechResultList[3];
        var re = new RegExp("\\b" + positionText + "\\b",'i');
        var index_positionText = inputText.search(re);

        var re_entity = new RegExp("\\b" + entity + "\\b",'i')
        var index_entityText = inputText.search(re_entity);

        var result = ''
        console.log(index_entityText);
        console.log(index_positionText);
        if(index_positionText >=0 && index_entityText>=0)
        {
                if(position === 'after')
                {
                    console.log(index_entityText);
                    result = inputText.substring(0,index_positionText+ positionText.length)+ ' '+ entity +inputText.substring(index_positionText+ positionText.length);
                    console.log(result);

                } else if(position === 'before' )
                {
                    console.log(index_entityText);
                    result = inputText.substring(0,index_positionText)+entity+' ' + inputText.substring(index_positionText);
                    console.log(result);

                } else if(position === 'between')
                {
                    re_bn=new RegExp("\\b" + speechResultList[5] + "\\b",'i');
                    var index_bn = inputText.search(re_bn);
                    if(index_bn >= 0)
                    {
                        result = inputText.substring(0,index_positionText+ positionText.length+1)+entity+' '+inputText.substring(index_positionText+ positionText.length+1);
                    }
                    else
                    {
                        result = 'could not recognise your words properly';
                    }
                    console.log(index_entityText);
                    console.log(index_bn);
                    console.log(result);
                }
                result = result.replace(re_entity,"");
        }
        else
        {
            result = 'could not recognise your words properly';
        }
        
        resultPara.textContent = result;
        resultPara.style.background = 'red';

    }
    else if(query === 'replace' || query === 'change' || query ==='correct')  //single
    { 
        var target = speechResultList[3];
        var re = new RegExp("\\b" + entity + "\\b",'i')
        resultPara.textContent = inputText.replace(re,target);
        resultPara.style.background = 'lime';
    }
    
    else if(query === 'say' || query === 'stating') //single
    {
        if(speechResult === 'say correct sentence' || speechResult === 'stating correct sentence')
        {
            resultPara.textContent = inputText.replace(entity,target);//TODO
        resultPara.style.background = 'lime';
        }

    }
    console.log('Confidence: ' + event.results[0][0].confidence);
  }


  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}



var t0 = performance.now();

function dictation() {
    testBtn.disabled = true;
    testBtn.textContent = 'Test in progress';

    var phrase = phrases[0];
    phrase = phrase.toLowerCase();

    //phrasePara.textContent = phrase;
    resultPara.textContent = 'Successful or not';
    diagnosticPara.textContent = 'edited messages will be..';


  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar , 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();


  recognition.onresult = function(event) {
   
    var speechResult = event.results[0][0].transcript.toLowerCase();
    var speechResultList=speechResult.split(" ");
    console.log(speechResultList);
    console.log(typeof(speechResultList));


    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';

    var query = speechResultList[0];
    var entity = speechResultList[1];
    if(query === 'delete') {
        //var re = new RegExp(entity, 'g');
        var re = new RegExp("\\b" + entity + "\\b")
        var y= speechResult.substring(speechResult.indexOf(entity) + entity.length + 5);

    /*var separator = speechResultList[2];
      var result = speechResult.replace(entity,"");
      result = result.replace(entity,"");
      result = result.replace(query,"");*/


      resultPara.textContent = y.replace(re,"");
      resultPara.style.background = 'lime';
    } else if (query === 'insert') {


        var separator1 = speechResultList[2];
        var separator2 = speechResultList[3];
        var separator3 = speechResultList[5];
        var result = speechResult.replace(entity,"");
        result = result.replace(query,"");
        result = result.replace(separator1,"");
        result = result.replace(separator2,"");
        result = result.replace(separator3,entity);


      resultPara.textContent = result;
      resultPara.style.background = 'red';
    } else if (query === 'put') {


        var separator1 = speechResultList[2];
        var separator2 = speechResultList[3];
        var separator3 = speechResultList[5];
        var result = speechResult.replace(entity,"");
        result = result.replace(query,"");
        result = result.replace(separator1,"");
        result = result.replace(separator2,"");
        result = result.replace(separator3,entity);


        resultPara.textContent = result
        resultPara.style.background = 'red';
      } else if (query === 'add') {
          var position = speechResultList[2]; 
          var re = new RegExp(position, 'g');
          var y= speechResult.substring(speechResult.indexOf(position) + position.length + 1);
          if(position === 'between')
          {
           
            var result = y.replace("and",entity);
            
          } else if(position === 'after')
            {
                var result = y +' '+ entity;
            }
            else if(position === 'before')
            {
                var result = entity + ' ' + y;
            }
        resultPara.textContent = result;
        resultPara.style.background = 'red';
      }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }
  

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}
var t1 = performance.now();
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

testBtn.addEventListener('click', dictation);
textBtn.addEventListener('click', textSpeech);

