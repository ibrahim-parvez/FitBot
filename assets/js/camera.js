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
      buttonStop.removeAttribute('disabled')
    })
  
    buttonStop.addEventListener('click', () => {
      mediaRecorder.stop() // <5>
      buttonStart.removeAttribute('disabled')
      buttonStop.setAttribute('disabled', '')
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
      confirmButton.addEventListener('click', () => {
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = function () {
          const videoDataUrl = reader.result.split(',')[1]; // Get base64 part
      
          // Prepare the request payload
          const payload = {
            video: {
              content: videoDataUrl
            }
          };
      
          // Send the video to the proxy server
          fetch('http://localhost:3001/proxy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => {
            // Handle the response
            console.log('API Response:', data);
            // Process the response to get feedback on the exercise
            const feedback = data.responses[0].annotationResults[0].segmentLabelAnnotations[0].description;
            alert('Exercise Feedback: ' + feedback);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        };
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