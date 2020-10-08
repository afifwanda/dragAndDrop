let dropArea = document.getElementById("inputBox");
let fileUpload = null;

// Prevent default drag behaviors
;['dragenter','dragover','dragleave','drop'].forEach(event=>{
  dropArea.addEventListener(event,preventDefaults,false)
  document.body.addEventListener(event,preventDefaults,false)
})

// Highlight drop area when item is dragged over it
;['dragenter','dragover'].forEach(event=>{
  dropArea.addEventListener(event,highlight,false)
})

;['dragleave','drop'].forEach(event=>{
  dropArea.addEventListener(event,unhighlight,false)
})

// handle drop
dropArea.addEventListener('drop',handleDrop,false)

function preventDefaults(event){
  event.preventDefault()
  event.stopPropagation()
}

function highlight(event){
  dropArea.classList.add('highlight')
}

function unhighlight(event){
  dropArea.classList.remove('active')
}

function handleDrop(event){
  let data = event.dataTransfer
  let files = data.files
  fileUpload = files

  handleFiles(files)
}

function handleFiles(files) {
  files = [...files]

  files.forEach(previewFile)
}


function previewFile(file){
  let reader = new FileReader();
  reader.readAsDataURL(file)

  console.log(file,'ini file')

  reader.onloadend = function(){
    
    let element = document.createElement('div')
    element.innerHTML = `${file.name}`
    document.getElementById('gallery').appendChild(element) 
  }
}


//upload file to server

function uploadFile(){
  let baseUrl = 'http://localhost:8181';
  let files = [...fileUpload]

  files.forEach(response => {
    let formData = new FormData()
    formData.append("files",response)
  
    fetch(`${baseUrl}/upload`,{
      method: "POST",
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    })
    .then(response=>response.json())
    .then(response=>{
      document.getElementById('gallery').innerHTML = '';
      let element = document.createElement('div')
      let card = `<div class='topCard'>
                      <img src=${baseUrl}/${response.fileUrl}>
                    </div>
                    <div class='bottomCard'>
                      <p>${response.fileUrl.split('-').pop()}</p>
                      <a href=${baseUrl}/${response.fileUrl} download=${response.fileUrl.split('/').pop()} target='blank'>
                        <button class='downloadButton'>download</button>
                      </a>
                    </div>
                  </div>`
      element.innerHTML = card
      document.getElementById("uploads").appendChild(element)
    })
    .catch(err=>{
      console.log(err)
    })  
  });
  

}
