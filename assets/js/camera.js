async function main () {
    const buttonStart = document.querySelector('#start')
    const buttonStop = document.querySelector('#stop')
    const videoLive = document.querySelector('#video')
    const videoRecorded = document.querySelector('#videoRecorded')
  
    const stream = await navigator.mediaDevices.getUserMedia({ // <1>
      video: true,
    })
  
    videoLive.srcObject = stream
  
    if (!MediaRecorder.isTypeSupported('video/webm')) { // <2>
      console.warn('video/webm is not supported')
    }
  
    const mediaRecorder = new MediaRecorder(stream, { // <3>
      mimeType: 'video/webm',
    })
  
    buttonStart.addEventListener('click', () => {
      mediaRecorder.start() // <4>
      buttonStart.setAttribute('disabled', '')
      buttonStart.style.display = 'none';
      buttonStop.removeAttribute('disabled');
      buttonStop.style.display = 'block'
      buttonStart.style.display = 'none'
    })
  
    buttonStop.addEventListener('click', () => {
      mediaRecorder.stop() // <5>
      buttonStart.removeAttribute('disabled')
      buttonStart.style.backgroundColor = 'rgb(210, 36, 36)';
      buttonStop.setAttribute('disabled', '')
      buttonStop.style.display = 'none'
      buttonStart.style.display = 'block'
    })
  
    mediaRecorder.addEventListener('dataavailable', async event => {
      const videoBlob = event.data;
      const videoUrl = URL.createObjectURL(videoBlob);
      // Change title
      const pageTitle = document.getElementById('title');
      pageTitle.innerHTML = "Confirm Video";
      // Disable the live video feed
      const liveVideo = document.getElementById('vidcontainer');
      liveVideo.innerHTML = '';
      // Create a video element to display the recorded video
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      videoElement.playsinline = false;
      videoElement.autoplay = false;
      videoElement.src = videoUrl;
      videoElement.width = 640; // Set width as needed
      videoElement.height = 480; // Set height as needed
    
      // Create a confirm button
      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Confirm';
      confirmButton.addEventListener('click', async () => {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('video', blob, 'recorded-video.mp4');

        await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData
        });
      });

      // Create a back button
      const backButton = document.createElement('button');
      backButton.textContent = 'Back';
      backButton.addEventListener('click', () => {
        location.reload();
      });
    
      // Clear existing elements and add the new video element and confirm button
      const controlsDiv = document.getElementById('controls');
      controlsDiv.innerHTML = ''; // Clear existing controls
      controlsDiv.appendChild(videoElement);
      controlsDiv.appendChild(confirmButton);
      controlsDiv.appendChild(backButton);
    });
  }
main()